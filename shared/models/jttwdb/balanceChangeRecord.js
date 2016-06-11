var async = require('async');
var player = require('./player');
var factory = require('./jttwdbModelFactory.js');
var BalanceChangeRecordModel = factory.getModel('BalanceChangeRecordModel');

var BalanceChangeRecord = module.exports;

/**
 * Save event information.
 *
 * @param   {Object}   info      The info sent by thirdparty.
 *                               {
 *                                  openId: '',
 *                                  platform: 'iOS',
 *                                  pointAmount: 1,
 *                                  txnId: '',
 *                                  txnType: 1,
 *                                  channelName: '',    // optional
 *                                  currency: '',       // optional
 *                                  currencyAmount: '', // optional
 *                                  txnTimestamp: 111123,
 *                                  ip: '',
 *                                  test: 0
 *                               }
 * @param   {Function} cb        The callback function.
 */
BalanceChangeRecord.save = function (info, callback) {
    async.waterfall(
        [
            function(cb) {
                player.getPlayerInfoByOpenId(info.openId, function (err, doc) {
                    if (err) {
                        cb(err);
                        return;
                    }

                    info.uid = doc.uid;
                    info.nickName = doc.data.nickName;
                    cb();
                });
            },

            function (cb) {
                var rec = new BalanceChangeRecordModel(info);
                rec.save(function (err) {
                    if (err) {
                        cb(err);
                        return;
                    }
                    cb();
                });
            }
        ],
        function(err){
            callback(err);
        }
    );
};

/**
 * Get balance change record by uid, txnId and txnType.
 *
 * @param {String}    uid         The user id.
 * @param {String}    txnId       The txn id.
 * @param {Number}    txnType     The txn type.
 * @param {Function}  callback    The callback function.
 */
BalanceChangeRecord.getUnprocessedRecordByTxnId = function(uid, txnId, txnType, callback) {
    BalanceChangeRecordModel.findOne(
        {
            txnId: txnId,
            txnType: txnType,
            uid: uid,
            processed: false
        },
        function(err, doc) {
            if (err) {
                callback(err);
                return;
            }

            callback(null, doc);
        }
    );
};

/**
 * Get balance change record by uid.
 *
 * @param {String}    uid         The user id.
 * @param {Function}  callback    The callback function.
 */
BalanceChangeRecord.getUnprocessedRecord = function(uid, callback) {
    BalanceChangeRecordModel.find(
        {
            uid: uid,
            processed: false
        },
        function(err, docArr) {
            if (err) {
                callback(err);
                return;
            }

            callback(null, docArr);
        }
    );
};

/**
 * Get balance change record by uid and txnId.
 *
 * @param {Array}     txnIdArr    Array contains txnId.
 * @param {Function}  callback    The callback function.
 */
BalanceChangeRecord.setRecordProcessed = function(txnIdArr, callback) {
    if (!Array.isArray(txnIdArr)) {
        throw new Error('Bad argument');
    }
    
    BalanceChangeRecordModel.update(
        {txnId : {$in: txnIdArr}},
        {$set: {processed: false}},
        {upsert: false, multi: true},
        function(err, doc) {
            if (err) {
                callback(err);
                return;
            }
            if (!doc) {
                callback(new Error('Failed to find record.'));
                return;
            }

            callback(null, doc);
        }
    );
};

