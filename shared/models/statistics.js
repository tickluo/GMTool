var util = require('util');
var EventEmitter = require('events');
var dbConnFactory = require('./dbConnFactory.js');
var ModelFactory = require('./modelFactory.js');

//// Schemas.
var onlineUserStatSchema = require('./accountdb/onlineUserStatSchema.js');
var accountSchema = require('./accountdb/accountSchema.js');
var playerLogSchema = require('./jttwdb/playerLogSchema.js');


/**
 * You **MUST** call Statistics.release() to disconnect the connections when
 * you've done the query.
 */
var Statistics = function (accountdbUrl, jttwdbUrl, cb) {
    // Init base first.
    EventEmitter.call(this);
    
    this.accountdbConn = dbConnFactory.getConn(accountdbUrl);
    this.accountdbConn.registerEventReceiver(this);

    this.jttwdbConn = dbConnFactory.getConn(jttwdbUrl);
    this.jttwdbConn.registerEventReceiver(this);
    
    this.modelFactory = new ModelFactory();

    this.onOpenCb = cb;
    
    this.playerLogModel = this.modelFactory.createModel(
        this.jttwdbConn, 'PlayerLogModel', playerLogSchema);
    this.accountModel = this.modelFactory.createModel(
        this.accountdbConn, 'AccountModel', accountSchema);
    this.onlineUserStatModel = this.modelFactory.createModel(
        this.accountdbConn, 'OnlineUserStatModel', onlineUserStatSchema);

    this.accountdbOpened = false;
    this.jttwdbOpened = false;
    this.hasError = false;

    this.on('open', this.onDBOpen.bind(this));
    this.on('error', this.onDBError.bind(this));
};

util.inherits(Statistics, EventEmitter);

module.exports = Statistics;

var pro = Statistics.prototype;

/**
 * On db open callback.
 *
 * @param {Object}      err          The Error object.
 * @param {Object}      dbConn       The DBConn object.
 */
pro.onDBOpen = function(err, dbConn) {
    console.log('dbopen');
    if (this.hasError) {
        return;
    }
    
    if (err) {
        this.onOpenCb(err);
        this.hasError = true;
        return;
    }

    if (dbConn === this.jttwdbConn) {
        this.jttwdbOpened = true;
    }

    if (dbConn === this.accountdbConn) {
        this.accountdbOpened = true;
    }

    if (this.jttwdbOpened && this.accountdbOpened) {
        this.onOpenCb();
        return;
    }
};

/**
 * On db error callback.
 *
 * @param {Object}      err          The Error object.
 */
pro.onDBError = function(err) {
    if (this.hasError) {
        return;
    }

    this.hasError = true;
    this.onOpenCb(err);
};

/**
 * Release db connections and other resources.
 *
 */
pro.release = function() {
    this.accountdbConn.db.close();
    this.jttwdbConn.db.close();
    this.accountdbConn = null;
    this.jttwdbConn = null;
    this.modelFactory = null;
    
    this.playerLogModel = null;
    this.accountModel = null;
    this.onlineUserStatModel = null;
};

/**
 * Query the player's total online time and level in game between two dates.
 * If beginDate and endDate are null, the function will check yestoday's
 * statistics.
 *
 * @param {Date}      beginDate     The begin date of the statistics.
 * @param {Date}      endDate       The end date of the statistics.
 * @param {Function}  callback      function(err, [doc1, doc2, ...])
 */
pro.dailyOnlineActivity = function (beginDate, endDate, callback) {
    if ((beginDate && !endDate) || (!beginDate && endDate) ||
        typeof callback !== 'function') {
        process.nextTick(function() {
            callback(new Error('Bad params.'));
        });
        return;
    }

    if ((beginDate && !(beginDate instanceof Date)) ||
        (endDate && !(endDate instanceof Date))) {
        process.nextTick(function() {
            callback(new Error('Bad params.'));
        });
        return;
    }

    if (!beginDate) {
        beginDate = getDefaultBeginDate();
        endDate = getDefaultEndDate();
    }

    console.log(beginDate);
    console.log(endDate);
    
    this.playerLogModel.aggregate(
        [
            {$match: {$and:
                      [
                          {date: {$gt: beginDate}},
                          {date: {$lt: endDate}}
                      ]
                     }
            },
            {$group:{_id: '$uid', total: {$sum:{$subtract:["$body.login.logout", "$date"]}}}},
            {$project:{_id:1, userName: 1, totalMin:{$divide:["$total",60000]}}},
            {$lookup: {from: 'player', localField: '_id', foreignField:'uid', as:'data'}},
            {$unwind: '$data'},
            {$project: {_id:1, userName: 1, totalMin: 1, level: "$data.data.level"}}
        ]
    ).exec(callback);
};

/**
 * Get max/min/avg online users.
 *
 * @param {Date}      beginDate     The begin date of the statistics.
 * @param {Date}      endDate       The end date of the statistics.
 * @param {Function}  callback      function(err, [doc1, doc2, ...])
 */
pro.getOnlineUserStats = function (beginDate, endDate, callback) {
    if ((beginDate && !endDate) || (!beginDate && endDate) ||
        typeof callback !== 'function') {
        process.nextTick(function() {
            callback(new Error('Bad params.'));
        });
        return;
    }

    if ((beginDate && !(beginDate instanceof Date)) ||
        (endDate && !(endDate instanceof Date))) {
        process.nextTick(function() {
            callback(new Error('Bad params.'));
        });
        return;
    }

    if (!beginDate) {
        beginDate = getDefaultBeginDate();
        endDate = getDefaultEndDate();
    }

    this.onlineUserStatModel.aggregate(
        [
            {$match: {$and:
                      [
                          {date: {$gt: beginDate}},
                          {date: {$lt: endDate}}
                      ]
                     }
            },
            {$sort: {total: 1}},
            {
                $group: {
                    _id: "$sid",
                    total: {$sum: "$total"},
                    records: {$sum: 1},
                    max: {$last: '$total'},
                    min: {$first: '$total'},
                    avg: {$avg: '$total'}
                }
            }

        ]
    ).exec(callback);
};

/**
 * Get the new registed uid and openId.
 *
 * @param {Date}      beginDate     The begin date of the statistics.
 * @param {Date}      endDate       The end date of the statistics.
 * @param {Function}  callback      function(err, [doc1, doc2, ...])
 */
pro.getNewUidOpenId = function (beginDate, endDate, callback) {
    if ((beginDate && !endDate) || (!beginDate && endDate) ||
        typeof callback !== 'function') {
        process.nextTick(function() {
            callback(new Error('Bad params.'));
        });
        return;
    }

    if ((beginDate && !(beginDate instanceof Date)) ||
        (endDate && !(endDate instanceof Date))) {
        process.nextTick(function() {
            callback(new Error('Bad params.'));
        });
        return;
    }

    if (!beginDate) {
        beginDate = getDefaultBeginDate();
        endDate = getDefaultEndDate();
    }

    this.accountModel.find(
        {$and:[{date: {$gt: beginDate}},{date: {$lt: endDate}}]},
        {_id: 0, uid: 1, openId: 1},
        callback
    );
};

/**
 * Get total login times between two dates.
 *
 * @param {Date}      beginDate     The begin date of the statistics.
 * @param {Date}      endDate       The end date of the statistics.
 * @param {Function}  callback      function(err, count)
 */
pro.getTotalLogin = function (beginDate, endDate, callback) {
    if ((beginDate && !endDate) || (!beginDate && endDate) ||
        typeof callback !== 'function') {
        process.nextTick(function() {
            callback(new Error('Bad params.'));
        });
        return;
    }

    if ((beginDate && !(beginDate instanceof Date)) ||
        (endDate && !(endDate instanceof Date))) {
        process.nextTick(function() {
            callback(new Error('Bad params.'));
        });
        return;
    }

    if (!beginDate) {
        beginDate = getDefaultBeginDate();
        endDate = getDefaultEndDate();
    }

    this.playerLogModel.find(
        {$and:
         [
             {date: {$gt: beginDate}},
             {date: {$lt: endDate}},
             {logType: 'login'}
         ]
        },
        {_id: 1}
    ).count(callback);
};

/**
 * Get the default beginning date for statistics.
 *
 * @return {Date}
 */
function getDefaultBeginDate() {
    var now = new Date();
    var beginDate = new Date(Date.UTC(
        now.getUTCFullYear(), now.getUTCMonth() , now.getUTCDate(), 16));
    beginDate.setUTCDate(beginDate.getUTCDate() - 2);
    
    return beginDate;
}

/**
 * Get the default ending date for statistics.
 *
 * @return {Date}
 */
function getDefaultEndDate() {
    var now = new Date();
    var endDate = new Date(Date.UTC(
        now.getUTCFullYear(), now.getUTCMonth() , now.getUTCDate(), 16));
    endDate.setUTCDate(endDate.getUTCDate() - 1);

    return endDate;
}
