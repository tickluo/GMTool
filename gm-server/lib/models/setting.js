/**
 * Created by zhongjie.zhang on 2016/3/18.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var dbConn = require('../dbConn');

var Setting = module.exports;

////////////////////////////////////////////////////////////////////////////////
/// Error log schema.
//////
var settingSchema = new Schema({
    k: {
        type: String,
        required: true
    },
    v: {
        type: String,
        required: true
    }
}, {
    strict: true,
    autoIndex: false,
    collection: 'setting',
    minimize: true
});

// Create index.
settingSchema.index({
    k: 1
}, {
    unique: false
});

var SettingModel = dbConn.db.model('Setting', settingSchema);
SettingModel.ensureIndexes(function (err) {
    if (err) {
        throw err;
    }
});

Setting.save = function (key, value, cb) {
    SettingModel.findOneAndUpdate({
            k: key
        }, {
            $set:{k:key,v:value}
        }, {
            upsert: true
        },
        function (err, doc) {
            cb(err, doc);
        });
};

Setting.get = function (key, cb) {
    SettingModel.findOne({
            k: key
        },
        function (err, doc) {
            cb(err, doc);
        }
    );
};

Setting.getAll = function ( cb) {
    SettingModel.find({},
        function (err, doc) {
            cb(err, doc);
        }
    );
};