var crypto = require('crypto');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var dbConn = require('../dbConn');

var Account = module.exports;

var accountSchema = new Schema({
    uid: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: false
    }
}, {
    strict: false,
    autoIndex: false,
    collection: 'account',
    minimize: false
});

// Create index for userName.
accountSchema.index({
    userName: 1
}, {
    unique: true
});

// Create index for uid.
accountSchema.index({
    uid: 1
}, {
    unique: true
});

var AccountModel = dbConn.db.model('account', accountSchema);

AccountModel.ensureIndexes(function (err) {
    if (err) {
        throw err;
    }
});

var salt = "moh83pFdr2Zz4n27sCSbKrHBkk9a+RnBdlxG8dj2HI46ZTUNGvFjtZR1advvqtI0";

Account.login = function (userName, password, callback) {
    var shaSum = crypto.createHash('sha256');
    var tempPwd = password;
    tempPwd += salt;
    shaSum.update(tempPwd);
    AccountModel.findOne({
        userName: userName,
        password: shaSum.digest('hex')
    }, function (err, doc) {
        if (!!doc) {
            callback(null, doc.toObject());
        } else {
            callback(new Error("Login: User " + userName +
                " password doesn't match."));
        }
    });
};


Account.findUser = function (userName, callback) {
    AccountModel.findOne({
        userName: userName
    }, {uid: 1}, function (err, doc) {
        callback(err, doc);
    });
};

/**
 * Register
 *
 * @param: {Object}     uInfo     {
 *                                 userName:'',
 *                                 password: ''
 *                                }
 * @param: {Function}   callback
 */
Account.register = function (uInfo, callback) {
    var shaSum = crypto.createHash('sha256');
    var tempPwd = uInfo.password;
    var uid = new mongoose.Types.ObjectId().toString();

    tempPwd += salt;
    shaSum.update(tempPwd);

    var user = new AccountModel({
        uid: uid,
        openId: uid,
        userName: uInfo.userName,
        password: shaSum.digest('hex'),
        name: uInfo.name,
        role: uInfo.role
    });

    user.save(function (err) {
        if (!!err) {
            callback(err);
        } else {
            callback(null, uInfo);
        }
    });
};

Account.changePassword = function (userName, oldPass, newPass, callback) {
    var oldShaSum = crypto.createHash('sha256');
    oldPass += salt;
    oldShaSum.update(oldPass);

    // Here we had found the user.
    var newShaSum = crypto.createHash('sha256');
    newPass += salt;
    newShaSum.update(newPass);

    var hashedPassword = newShaSum.digest('hex');

    AccountModel.findOneAndUpdate({
            userName: userName,
            password: oldShaSum.digest('hex')
        }, {
            $set: {
                password: hashedPassword
            }
        }, {
            upsert: false,
            select: {
                uid: 1
            }
        },
        function (err, doc) {
            if (!!doc) {
                callback(null, doc.uid);
            } else {
                callback(new Error('Failed to find user.'));
            }
        });
};