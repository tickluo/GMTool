/**
 * Created by user on 2015/6/8.
 */
var FriendModel = require('./jttwdbModelFactory.js').getModel('FriendModel');
var FriendList = module.exports;

FriendList.getFriend = function(uid, cb){
    FriendModel.findOne({uid:uid},{friend:1}, cb);
};

FriendList.get = function (uid, cb) {
    FriendModel.findOne({uid:uid}).exec( function (err, doc) {
        if (!!err) {
            cb(err);
        } else {
            cb(err, doc);
        }
    });
};

FriendList.update = function (uid, data, cb) {
    FriendModel.findOneAndUpdate({uid : uid},
        {$set : data},
        {upsert : true}, function(err, doc) {
            if (!!err) {
                cb(err);
            } else {
                cb(err, doc);
            }
        });
};

FriendList.giveEnergy = function(uid, friendUids, cb){
    var updateStr = {};
    updateStr['getEnergy.'+uid] = 1;
    FriendModel.update({'uid':{$in:friendUids}}, updateStr, {multi: true}, function(err){
        cb(err);
    });
};

FriendList.reset = function(cb){
    FriendModel.update({}, {'giveEnergy':{},'getEnergy':{}},{multi: true}, function(err){
       cb(err);
    });
};

