var PlayerLogModel = require('./jttwdbModelFactory.js').getModel('PlayerLogModel');
var pomelo = require('pomelo');

var logger;
if (pomelo.app) {
    logger = require('pomelo-logger').getLogger('pomelo', __filename);
} else {
    logger = require('pomelo-logger').getLogger('apiService');
}

var logType = {
    LOGIN : 'login',
    ENTER_LEVEL : 'enterLevel',
    RECHARGE : 'recharge',
    BUY_ITEM : 'buyItem',
    SEND_POINT : 'sendPoint',
    GOLD_FINGER: 'goldFinger',
    CHANGE_NICKNAME: 'changeNickName'
};

var PlayerLog = module.exports;

/**
 * Log the login event.
 *
 * @param   {Object}   uInfo     {uid: '', userName: '', platform: 'iOS',
 *                                  loginType: '', ip: ''}
 * @param   {Function} cb        The callback function.
 */
PlayerLog.login = function(uInfo, cb) {
    var log = new PlayerLogModel({
        uid : uInfo.uid,
        userName : uInfo.userName,
        logType : logType.LOGIN,
        body : {
            login: {
                platform: uInfo.platform,
                loginType: uInfo.loginType,
                ip: uInfo.ip
            }
        }
    });
    
    log.save(function(err, doc) {
        if (err) {
            logger.error('PlayerLog::login: uInfo is %j. Err message is %s. ' +
                         'Error is %j.', uInfo, err.message, err);
            cb (err);
        } else {
            cb(null, doc.id);
        }
    });
};

/**
 * Update the logout time.
 *
 * @param   {String}   docId     The id of the doc
 * @param   {String}   uname     User's name.
 */
PlayerLog.logout = function(docId) {
    PlayerLogModel.findOneAndUpdate(
        {_id: docId},
        {$set: {'body.login.logout': Date.now()}},
        {upsert: false, select: {_id: 1}},
        function (err, doc) {
            if (!err && !doc) {
                err = new Error('PlayerLog::logout: docId not find ' + docId);
            }
            if (err) {
                logger.error(
                    'PlayerLog::logout: err is %s. docId is %s.',
                    err.message, docId);
            }
        }
    );
};

/**
 * Log the enter level event.
 *
 * @param   {String}   uid       User's id.
 * @param   {String}   uname     User's name.
 * @param   {Object}   levelInfo {levelId: 'id', ...}
 */
PlayerLog.enterLevel = function(uid, uname, levelInfo) {
    var log = new PlayerLogModel({
        uid : uid,
        userName : uname,
        logType : logType.ENTER_LEVEL,
        body : {enterLevel : {levelId : levelInfo.levelId}}
    });
    log.save(function(err) {
        if (err) {
            logger.error(
                'PlayerLog::enterLevel: uid is %s. uname is %s. levelInfo is %j. ' +
                    'Err message is %s. Error is %j.',
                uid, uname, levelInfo, err.message, err);
        }
    });
};

/**
 * Log the recharge event.
 *
 * @param   {String}   uid           User's id.
 * @param   {String}   uname         User's name.
 * @param   {Object}   info          {rechargeId: '', cash: 100, realMoney:1000,
 *                                     rechargeTimes: 1, platform: 'iOS'}
 */
PlayerLog.recharge = function(uid, uname, info) {
    var log = new PlayerLogModel({
        uid : uid,
        userName : uname,
        logType : logType.RECHARGE,
        body : {
            recharge : {
                rechargeId : info.rechargeId,
                cash : info.cash,
                realMoney : info.realMoney,
                rechargeTimes : info.rechargeTimes,
                platform : info.platform
            }
        }
    });

    log.save(function(err) {
        if (err) {
            logger.error(
                'PlayerLog::recharge: uid is %s. uname is %s. Info is %j. ' +
                    'Err message is %s. Error is %j.',
                uid, uname, info, err.message, err);
        }
    });
};

/**
 * Log the buy item event.
 *
 * @param   {String}   uid           User's id.
 * @param   {String}   uname         User's name.
 * @param   {Object}   info          {txnId: '', itemId: '', quantity: 1, totalCost: 400}
 */
PlayerLog.buyItem = function(uid, uname, info) {
    var log = new PlayerLogModel({
        uid : uid,
        userName : uname,
        logType : logType.BUY_ITEM,
        body : {
            buyItem : {
                txnId : info.txnId,
                itemId : info.itemId,
                quantity : info.quantity,
                totalCost: info.totalCost
            }
        }
    });

    log.save(function(err) {
        if (err) {
            logger.error(
                'PlayerLog::buyItem: uid is %s. uname is %s. Info is %j. ' +
                    'Err message is %s. Error is %j.',
                uid, uname, info, err.message, err);
        }
    });
};

/**
 * Log the send point event.
 *
 * @param   {String}   uid           User's id.
 * @param   {String}   uname         User's name.
 * @param   {Object}   info          {txnId: '', reason: '', amount: 1}
 */
PlayerLog.sendPoint = function(uid, uname, info) {
    var log = new PlayerLogModel({
        uid : uid,
        userName : uname,
        logType : logType.SEND_POINT,
        body : {
            sendPoint : {
                txnId : info.txnId,
                reason : info.reason,
                amount : info.amount
            }
        }
    });

    log.save(function(err) {
        if (err) {
            logger.error(
                'PlayerLog::sendPoint: uid is %s. uname is %s. Info is %j. ' +
                    'Err message is %s. Error is %j.',
                uid, uname, info, err.message, err);
        }
    });
};

/**
 * Log the gold finger event.
 *
 * @param   {String}   uid           User's id.
 * @param   {String}   uname         User's name.
 * @param   {Object}   info          {price: 12, amount: 1}
 */
PlayerLog.goldFinger = function(uid, uname, info) {
    var log = new PlayerLogModel({
        uid : uid,
        userName : uname,
        logType : logType.GOLD_FINGER,
        body : {
            goldFinger : info
        }
    });

    log.save(function(err) {
        if (err) {
            logger.error(
                'PlayerLog::goldFinger: uid is %s. uname is %s. Info is %j. ' +
                    'Err message is %s. Error is %j.',
                uid, uname, info, err.message, err);
        }
    });
};

/**
 * Change nickname.
 *
 * @param   {String}   uid           User's id.
 * @param   {String}   uname         User's name.
 * @param   {String}   oldNickName
 * @param   {String}   newNickName
 */
PlayerLog.changeNickName = function(uid, uname, oldNickName, newNickName) {
    var log = new PlayerLogModel({
        uid : uid,
        userName : uname,
        logType : logType.CHANGE_NICKNAME,
        body : {
            changeNickName: {
                oldName: oldNickName,
                newName: newNickName
            }
        }
    });

    log.save(function(err) {
        if (err) {
            logger.error(
                'PlayerLog::changeNickName: uid is %s. uname is %s. Old is %s. ' +
                    'New is %s. Err message is %s. Error is %j.',
                uid, uname, oldNickName, newNickName, err.message, err);
        }
    });
};

