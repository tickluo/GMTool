var async = require('async');
var Statistics = require('./statistics.js');
var dbCfg = require('../config/mongodb.json').development;

var statistics;

function mytest() {
    var count = 0;
    
    async.whilst(
        function(){
            return count < 1;
        },
        function(callback){
            ++count;
            console.log('######################### Round %d.', count);            
            queryWaterfall(callback);
        },
        function(err) {
            if (err) {
                console.log(err.message);
                return;
            }

            console.log('Done');
            process.exit(0);
        }
    );
}

function queryWaterfall(callback) {
    async.waterfall(
        [
            function(cb) {
                if (statistics) {
                    // Release the connection.
                    statistics.release();
                    statistics = null;
                }
                
                statistics = new Statistics(
                    dbCfg.accountdbUrl, dbCfg.jttwdbUrl,
                    function(err) {
                        cb(err);
                    }
                );
            },

            function(cb) {
                console.log('All dbs are connected.');
                statistics.dailyOnlineActivity(null, null, function(err, docArr) {
                    if (err) {
                        cb(err);
                        return;
                    }

                    if (!docArr) {
                        cb(new Error('docArr is null'));
                        return;
                    }

                    console.log('--------------------DailyOnlineActivity results: docArr len is %d', docArr.length);
                    for (var i = 0; i < docArr.length; ++i) {
                        console.log(docArr[i]);
                    }

                    cb();
                });
            }
                    
            // function(cb) {
            //     statistics.getOnlineUserStats(null, null, function(err, docArr) {
            //         if (err) {
            //             cb(err);
            //             return;
            //         }

            //         console.log('--------------------OnlineUserStats results:');
            //         for (var i = 0; i < docArr.length; ++i) {
            //             console.log(docArr[i]);
            //         }

            //         cb();
            //     });
            // },

            // function(cb) {
            //     statistics.getNewUidOpenId(null, null, function(err, docArr) {
            //         if (err) {
            //             cb(err);
            //             return;
            //         }

            //         console.log('--------------------NewUIdOpenId results:');
            //         for (var i = 0; i < docArr.length; ++i) {
            //             console.log(docArr[i]);
            //         }

            //         cb();
            //     });
            // },

            // function(cb) {
            //     statistics.getTotalLogin(null, null, function(err, count) {
            //         if (err) {
            //             cb(err);
            //             return;
            //         }

            //         console.log('--------------------Total login count is %d.', count);

            //         cb();
            //     });
            // }
        ],
        function(err) {
            callback(err);
        }
    );
}

mytest();
