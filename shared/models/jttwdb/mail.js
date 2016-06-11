var mongoose = require('mongoose');
var MailModel = require('./jttwdbModelFactory.js').getModel('MailModel');

var Mail = module.exports;

////////////////////////////////////////////////////////////////////////////////
/// Api Impelmation.
//////

/**
 * Save user mail.
 *
 * @param   {String}   uid       User's id.
 * @param   {Object}   mail      {bodyId: id, read: false, sent: 1, expire: 2, taken false}
 * @param   {Function} cb        The callback function. The mail instance will be callbacked.
 */
Mail.saveMail = function (uid, mail, cb) {
    var setObj = {};
    var objId = mongoose.Types.ObjectId();
    var key = "mails." + objId;
    setObj[key] = mail;

    MailModel.findOneAndUpdate({
            userId: uid
        }, {
            "$set": setObj
        }, {
            upsert: true,
            select: '_id'
        },
        function (err) {
            cb(err, objId);
        }
    );
};

/**
 * Get mail by id
 *
 * @param   {String}   uid       User's id.
 * @param   {String}   mailId    The id of mail
 * @param   {Function} cb        The callback function.
 */
Mail.getMailById = function (uid, mailId, cb) {
    var key = "mails." + mailId;
    var selectObj = {};
    selectObj._id = 0;
    selectObj[key] = 1;

    MailModel.findOne({
            userId: uid
        },
        selectObj,
        function (err, doc) {
            if (!!doc) {
                cb(err, doc.mails[mailId]);
            } else {
                cb(err);
            }
        }
    );
};

/**
 * Get all user mails.
 *
 * @param   {String}   uid       User's id.
 * @param   {Function} cb        The callback function.
 */
Mail.getAllMails = function (uid, cb) {
    MailModel.findOne({
        userId: uid
    }, {
        '_id': 0,
        'mails': 1
    }, function (err, doc) {
        if (!!doc) {
            cb(err, doc.mails);
        } else {
            cb(err, null);
        }
    });
};

/**
 * Save valid mail. Call this function when you remove all expired mails.
 *
 * @param   {String}   uid       User's id.
 * @param   {Array}    mails     The mail array.
 * @param   {Function} cb        The callback function.
 */
Mail.saveValidMails = function (uid, mails, cb) {
    MailModel.findOneAndUpdate({
            userId: uid
        }, {
            "$set": {
                mails: mails
            }
        }, {
            upsert: false,
            select: '_id'
        },
        function (err) {
            cb(err, mails);
        }
    );
};

/**
 * Delete user mail.
 *
 * @param   {String}   uid       User's id.
 * @param   {String}   mailId    The id of the mail.
 * @param   {Function} cb        The callback function. The mail list will be callbacked.
 */
Mail.deleteMail = function (uid, mailId, cb) {
    var unsetObj = {};
    var key = "mails." + mailId;
    unsetObj[key] = 1;

    MailModel.findOneAndUpdate({
            userId: uid
        }, {
            "$unset": unsetObj
        }, {
            upsert: false,
            select: '_id'
        },
        function (err, doc) {
            cb(err, doc);
        }
    );
};

/**
 * User has already read the mail. This function set the 'read' flag to be 'true'.
 *
 * @param   {String}   uid       User's id.
 * @param   {String}   mailId    The id of the mail.
 * @param   {Function} cb        The callback function. The mail list will be callbacked.
 */
Mail.readMail = function (uid, mailId, cb) {
    var setObj = {};
    var key = "mails." + mailId + ".read";
    setObj[key] = true;

    MailModel.findOneAndUpdate({
            userId: uid
        }, {
            "$set": setObj
        }, {
            upsert: false,
            select: '_id'
        },
        function (err, doc) {
            cb(err, doc);
        }
    );
};

/**
 * The user takes the attachment of the mail.
 *
 * @param   {String}   uid       User's id.
 * @param   {String}   mailId    The id of the mail.
 * @param   {Function} cb        The callback function. The mail list will be callbacked.
 */
Mail.takeAttachment = function (uid, mailId, cb) {
    var setObj = {};
    var key = "mails." + mailId + ".taken";
    setObj[key] = true;

    MailModel.findOneAndUpdate({
            userId: uid
        }, {
            "$set": setObj
        }, {
            upsert: false,
            select: '_id'
        },
        function (err, doc) {
            cb(err, doc);
        }
    );
};
