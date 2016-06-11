/**
 * Created by user on 2015/5/25.
 */
var ArchiveModel = require('./jttwdbModelFactory.js').getModel('ArchiveModel');
var Archive = module.exports;

////////////////////////////////////////////////////////////////////////////////
/// Api Implementation.
//////
Archive.saveRefreshData = function (key, kData, cb) {
    var set = {data:kData};
    ArchiveModel.findOneAndUpdate({
            typeName: key
        }, {
            $set:set
        }, {
            upsert: true
        },
        function (err, doc) {
            cb(err, doc);
        });
};

Archive.saveArchive = function (type, vs, cb) {
    this.getArchive(type, function (err, doc) {
        var archive = null;
        if (!!doc) {
            ArchiveModel.findOneAndUpdate({
                    typeName: type
                }, {
                    $set: {
                        data: vs
                    }
                }, {
                    upsert: false
                },
                function (err, doc) {
                    cb(err, doc);
                });
        } else {
            archive = new ArchiveModel({
                typeName: type,
                data: vs
            });
            archive.save(function (err, doc) {
                if (!!doc) {
                    cb(err, doc);
                } else {
                    cb(err);
                }
            });
        }
    });
};

Archive.getArchive = function (type, cb) {
    ArchiveModel.findOne({
            typeName: type
        },
        function (err, doc) {
            if (!!doc) {
                cb(err, doc);
            } else {
                cb(err);
            }
        }
    );
};
