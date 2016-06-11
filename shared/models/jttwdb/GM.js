/**
 * Created by user on 2015/5/25.
 */
var GMModel = require('./jttwdbModelFactory.js').getModel('GMModel');
var GM = module.exports;

////////////////////////////////////////////////////////////////////////////////
/// Api Implementation.
//////
GM.remove = function(uid, cb){
    GMModel.remove({'uid' : uid},function(err){
        cb(err);
    });
};
GM.removeAny = function(ids, cb){
    GMModel.remove({'uid' : {$in:ids}},function(err){
        cb(err);
    });
};

GM.create = function(data, cb){
    GMModel.create(data,function(err){
        cb(err);
    });
};

GM.save = function (uid, data, cb) {
    GMModel.findOneAndUpdate(
        {'uid': uid},
        {"$set": data},
        {upsert: true},
        function (err, doc) {
            if (!!err) {
                console.log(err);
            }
            cb(err, doc);
    });
};

GM.getOne = function (uid, cb) {
    GMModel.find({'uid':uid}, function(err, doc){
        cb(err, doc);
   });
};

GM.getAll = function (q, cb) {
    GMModel.find(q, function(err, docs){
        cb(err, docs);
    });
};
