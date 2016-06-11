/**
 * Created by user on 2015/6/8.
 */
var RankListModel = require('./jttwdbModelFactory.js').getModel('RankListModel');
var RankList = module.exports;

RankList.hasRankInfo = function(rankId, cb){
    RankListModel.find({'rankId':rankId}, function(err, docs){
       if(!err){
           cb(docs.length > 0);
       }else{
           cb(false);
       }
    });
};

RankList.updateUserInfo = function(uid, newInfo, cb){
    RankListModel.update({'uid':uid},
        {$set: newInfo},
        {upsert: false, multi: true},
        cb);
};

RankList.removeRank = function(rankId, cb){
    RankListModel.remove({rankId:rankId}, function(err){
       cb(err);
    });
};

RankList.addRankInfo = function(rankId, vs, cb){
    var ids = [];
    for(var i in vs){
        ids.push(vs[i].uid);
    }
    RankListModel.remove({rankId:rankId, uid:{$in:ids}}, function(err){
        if(!!err){
            cb(err);
        }
        else{
            RankListModel.create(vs, function(err2, docs){
                cb(err2, docs);
            });
        }
    });
};

RankList.createRank = function (rankId, vs, cb) {
    RankListModel.remove({rankId:rankId}, function(err){
        if(!err){
            RankListModel.create(vs, function(err2, docs){
                cb(err2, docs);
            });
        }
        else{
            cb(err);
        }
    });
};

RankList.getRank = function (rankId, cb) {
    RankListModel.find({rankId:rankId}).sort({rank:1}).exec( function (err, doc) {
        if (!!err) {
            cb(err);
        } else {
            cb(err, doc);
        }
    });
};

RankList.getRankDetail = function (rankId, uid, cb) {
    RankListModel.findOne({rankId:rankId, uid:uid}).exec( function (err, doc) {
        if (!!err) {
            cb(err);
        } else {
            cb(err, doc);
        }
    });
};

RankList.getRankTop = function (rankId, top, cb) {
    RankListModel.find({rankId:rankId}).sort({rank:1}).limit(top).exec( function (err, doc) {
        if (!!err) {
            cb(err);
        } else {
            cb(err, doc);
        }
    });
};

