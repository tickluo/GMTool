/**
 * Created by user on 2015/5/25.
 */
var MoonModel = require('./jttwdbModelFactory.js').getModel('MoonModel');
var Moon = module.exports;

////////////////////////////////////////////////////////////////////////////////
/// Api Implementation.
//////
Moon.update = function(uid, data, cb){
    MoonModel.findOneAndUpdate(
        {'defense.uid': uid },
        {$set:data},
        {upsert: true},
        function (err, doc) {
            console.log(err);
            cb(err, doc);
        });
};

Moon.getAll = function(cb){
    MoonModel.find({}, function(err, docs){
        cb(err, docs);
    });
};

Moon.removeAll = function(cb){
    MoonModel.remove({}, cb);
};

Moon.remove = function(ids, cb){
  MoonModel.remove({'defense.uid' : {$in:ids}},function(err){
        cb(err);
    });
};

Moon.create = function(data, cb){
    MoonModel.create(data,function(err){
        cb(err);
    });
};

Moon.saveDefense = function (uid, data, cb) {
    var set = {defense:data};

    MoonModel.findOneAndUpdate(
        {'defense.uid': uid},
        {"$set": set}, 
        {upsert: true},
        function (err, doc) {
            if (!!err) {
                console.log(err);
            }
            cb(err, doc);
    });
};


Moon.saveHistory = function (uid, data, cb) {
    var set = {history:data};

    MoonModel.findOneAndUpdate(
        {'defense.uid': uid},
        {"$set": set}, 
        {upsert: true},
        function (err, doc) {
            if (!!err) {
                console.log(err);
            }
            cb(err, doc);
    });
};

Moon.get = function (uid, cb) {
   MoonModel.find({'defense.uid':uid}, function(err, doc){
        cb(err, doc);
   });
};
