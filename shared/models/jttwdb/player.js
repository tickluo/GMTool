// var crypto = require('crypto');
var mongoose = require('mongoose');
var PlayerModel = require('./jttwdbModelFactory.js').getModel('PlayerModel');
var Code = require('../../code');
var async = require('async');

var Player = module.exports;

////////////////////////////////////////////////////////////////////////////////
/// Api Impelmation.
//////
Player.initPlayerModel = function(defaultDoc, callback) {
    var player = new PlayerModel({
        uid : defaultDoc.uid,
        nuid: defaultDoc.nuid,
        openId: defaultDoc.openId,
        userName : defaultDoc.userName,
        isRobot:!!defaultDoc.isRobot?1:0,
        data : defaultDoc.data
    });

    async.waterfall(
        [
          function(cb) {
              // The default callback of save will have 3 arguments, if we
              // do not rewrite the callback, the waterfall will break at
              // the second function, because the second argument is not
              // a callback. The second argument will be (doc, value, cb).
              player.save(function(err, doc) {
                  if (!!err) {
                      cb(err, {code : Code.HERO.FA_HERO_DUPLICATED_NAME});
                      return;
                  }
                  cb(null, doc);
              });
          },

          function(doc, cb) {
              PlayerModel.findOneAndUpdate(
                  {_id : player.id, dataRev : doc.dataRev},
                  {$set : {'dump' : ''}, $inc : {dataRev : 1}},
                  {upsert : false, new : true}, function(err, doc) {
                      cb(err, doc);
                  });
          }
        ],
        function(err, doc) {
            if (!err && !doc) {
                err = new Error("Failed to init user.");
            }

            if (err) {
                callback(err, doc);
                return;
            }

            callback(null, doc);
        });
};

Player.tryGetPlayer = function(uid, callback) {
    PlayerModel.findOne({uid : uid}, function(err, doc) {
        if (!!err) {
            callback(err);
        } else {
            callback(null, doc);
        }
    });
};

Player.getPlayerByName = function(name, callback) {
    PlayerModel.findOne({userName : name}, function(err, doc) {
        if (!!doc) {
            callback(null, doc);
        } else {
            if (!err) {
                err = new Error(
                    "Player::getPlayer: Failed to find user: " + name);
            }
            callback(err);
        }
    });
};

Player.getPlayerByCondition = function(q, callback) {
    PlayerModel.findOne(q, function(err, doc) {
        if (!!doc) {
            callback(null, doc);
        } else {
            if (!err) {
                err = ("Player::getPlayer: Failed to find user, condition: " + JSON.stringify(q));
            }
            callback(err);
        }
    });
};

Player.getPlayerByConditionAndLimit = function(queryStr, sort, limit, callback) {
    PlayerModel.find(queryStr).sort(sort).limit(limit).exec(function(err, doc) {
        if (!!doc) {
            callback(null, doc);
        } else {
            if (!err) {
                err = ("Player::getPlayer: Failed to find user, condition: " + JSON.stringify(q));
            }
            callback(err);
        }
    });
};

Player.getPlayerByLevel = function(minLevel, maxLevel, callback) {
    PlayerModel.find(
        {$and: [{'data.level': {$gt: minLevel}}, {'data.level': {$lt: maxLevel}}]},
        {openId: 0,userName:0,dataRev:0,data:0,dump:0,date:0,_id:0,__v:0})
        .limit(30)
        .exec(function (err, docArr){
            if (!!docArr) {
                callback(null, docArr);
            } else {
                if (!err) {
                    err = new Error(
                        "Player::getPlayerByLevel: Failed to find Level: " + maxLevel);
                }
                callback(err);
            }
        }); 
};

Player.getPlayer = function(uid, callback) {
    PlayerModel.findOne({uid : uid}, function(err, doc) {
        if (!!doc) {
            callback(null, doc);
        } else {
            if (!err) {
                err =
                    new Error("Player::getPlayer: Failed to find user: " + uid);
            }
            callback(err);
        }
    });
};

Player.getPlayerInfoForWeb = function(uid, callback) {
    PlayerModel.findOne(
        {uid: uid},
        {
            'data.nickName': 1,
            'data.level': 1,
            'data.items.1.count':1,
            'data.items.2.count': 1
        },
        callback
    );
};

Player.testReadPlayer = function(user, callback) {
    PlayerModel.findOne({uid : user.uid, dataRev: user.dataRev}, function(err, doc) {
        if (!!doc) {
            callback(null, doc);
        } else {
            if (!err) {
                err =
                    new Error("Player::getPlayer: Failed to find user: " +
                              user.uid + ". DataRev is " + user.dataRev);
            }
            callback(err);
        }
    });
};


Player.getPlayerInfoByOpenId = function (openId, callback) {
    PlayerModel.findOne({openId: openId}, {uid: 1, 'data.nickName': 1}, function (err, doc) {
        if (err) {
            callback (err);
            return;
        }

        if (!doc) {
            callback(new Error('Failed to find openid ' + openId));
            return;
        }

        callback(null, doc);
    });
};

Player.getMaxNuid = function (cb) {
    PlayerModel.find({}, {nuid:1}).sort({nuid: -1}).limit(1).exec(cb);
};

Player.updateDataField = function(uid, param, callback) {
    PlayerModel.findOneAndUpdate(
        {uid : uid}, {$set : param}, {upsert : true}, function(err, doc) {
            if (!!doc) {
                callback(null, doc);
            } else {
                if (!err) {
                    err = new Error(
                        "Player::updateDataFiled: Failed. Uid is " + uid);
                }
                callback(err, {code : Code.FAIL});
            }
        });
};

Player.saveData = function(user, data, dataFields, callback) {
    var setObj = {};
    
    if (dataFields) {
        for (var s in dataFields) {
            setObj["data." + s] = data[s];
        }
    } else {
        setObj.data = data;
    }

    PlayerModel.findOneAndUpdate({uid : user.uid, dataRev : user.dataRev},
        {$set : setObj, $inc : {dataRev : 1}},
        {upsert : false, select : {dataRev : 1}}, function(err, doc) {
            if (!!doc) {
                user.dataRev += 1;
                callback(null, doc);
            } else {
                if (!err) {
                    err = new Error(
                        "Player::saveData: Failed to find record. Uid is " +
                        user.uid + ". DataRev is " + user.dataRev);
                }
                callback(err, {code : Code.FAIL});
            }
        });
};


/**
 * This API will get player from DB firstly, then, use handler to handle
 * the player data. finally it will save the player data. The signature
 * of the handler should be:
 *  void handler(err, playerdoc, arg1, arg2 ..., cb);
 *
 * @param {String}   uid         The user id.
 * @param {Object}   context     The 'this' pointer of handler.
 * @param {Function} handler     The handler function.
 * @param {Array}    args        The argument of this api's client.
 * @param {Function} upCb        The caller's callback.
 */
Player.retryUpdateData = function (uid, context, handler, args, upCb) {
    if (!uid || typeof uid !== 'string' || !handler ||
        typeof handler !== 'function' || !args || !Array.isArray(args)) {
        handler(new Error('Bad parameters.'));
        return;
    }

    var retryTimes = 0;
    var succeeded = false;
    var preDataRev = 0;
    var playerDoc;

    async.whilst(
        function() {
            return !succeeded && retryTimes < 3;
        },

        function (callback) {
            async.waterfall(
                [
                    function (cb) {
                        PlayerModel.findOne({uid: uid}, function (err, doc) {
                            if (err) {
                                cb(err);
                                return;
                            }

                            if (!doc) {
                                cb(new Error('Failed to find user'));
                                return;
                            }

                            preDataRev = doc.dataRev;
                            playerDoc = doc;
                            cb(null, doc);
                        });
                    },

                    function (doc, cb) {
                        // To generate arguments for handler.
                        // (err, doc, args..., cb)
                        var theArgs = args.slice();
                        theArgs.unshift(doc);
                        theArgs.unshift(null);
                        theArgs.push(cb);
                        handler.apply(context, theArgs);
                    },
                    
                    function (res, cb) {
                        PlayerModel.findOneAndUpdate(
                            {uid: uid, dataRev: preDataRev},
                            {$inc : {dataRev : 1}, $set:{data: playerDoc.data}},
                            {select: {dataRev: 1}, upsert: false},
                            function (err, doc) {
                                if (err) {
                                    cb(err);
                                    return;
                                }

                                if (!doc) {
                                    cb(new Error('Failed to find doc'));
                                    return;
                                }
                                succeeded = true;
                                cb(null, res);
                            }
                        );
                    }
                ],
                function (err, res) {
                    if (err) {
                        ++retryTimes;
                        setTimeout(callback, 500);
                        return;
                    }
                    callback(null, res);
                }
            );
        },
        function (err, res) {
            if (!succeeded) {
                err = new Error('Failed to update data.');
            }
            upCb(err, res);
        }
    );
};

// only for GMTool ---->
Player.updateData = function(uid, playerDoc, callback) {
    PlayerModel.findOneAndUpdate({uid : uid, dataRev : playerDoc.dataRev},
        {$inc : {dataRev : 1}, $set : {data : playerDoc.data} },
        {upsert : false, select : {'_id' : 1}}, function(err, doc) {
            if (!!doc) {
                callback(null, doc);
            } else {
                if (!err) {
                    err =
                        new Error("Player::updateData: Failed. Uid is " + uid);
                }
                callback(err, {code : Code.FAIL});
            }
        });
};
// <------------
/**
 * Update openId userName for OAuth.
 *
 * @param {Object}    info        {uid: '', openId:'', userName: ''}
 * @param {Function}  callback    The callback function.
 */
Player.updateForOAuth = function(info, callback) {
    async.waterfall(
        [
            function(cb) {
                PlayerModel.findOne(
                    {uid: info.uid},
                    {dataRev: 1},
                    function (err, doc) {
                        if (err) {
                            cb(err);
                            return;
                        }

                        if (!doc) {
                            cb(new Error('Failed to find doc.'));
                            return;
                        }
                        cb(null, doc.dataRev);
                    }
                );
            },

            function (rev, cb) {
                PlayerModel.findOneAndUpdate(
                    {uid : info.uid, dataRev : rev},
                    {
                        $set : {
                            openId: info.openId,
                            userName: info.userName
                        },
                        $inc : {
                            dataRev : 1
                        }
                    },
                    {upsert : false, select : {'_id' : 1}},
                    function(err, doc) {
                        if (err) {
                            cb(err);
                            return;
                        }
                        if (!doc) {
                            cb(new Error('Failed to find doc.'));
                            return;
                        }                        
                        cb();
                    }
                );
            }
        ], function(err){
            if (err) {
                callback(err);
                return;
            }

            callback(null);
        }
    );
};

Player.verifyPlayer = function(uid, callback) {
    PlayerModel.findOne({uid : uid}, '_id', function(err, doc) {
        if (!!doc) {
            callback(null);
        } else {
            if (!err) {
                err = new Error(
                    "Player::verifyPlayer: Failed to find player " + uid);
            }
            callback(err);
        }
    });
};

Player.getHero = function(uid, callback) {
    PlayerModel.findOne({uid : uid}, {'data' : 1}, function(err, doc) {
        if (!!doc) {
            callback(null, doc);
        } else {
            if (!err) {
                err = new Error(
                    "Player::getHero: failed to get hero. User is " + uid);
            }
            callback(err);
        }
    });
};

Player.getAllUserNames = function(cb) {
    PlayerModel.find(
        { userName: { $not: /^moon-.*/ }} ,
        null,
        {sort : {userName : 1}},
        function(err, docs) {
            cb(null, docs);
        }
    );
};

Player.getAllUser = function(cb) {
    PlayerModel.find({}, null, {}, function(err, docs) {
        cb(null, docs);
    });
};

/**
 * Create custom user for testers.
 *
 * @param:  {String}     templateUid       The user's doc will be a template for
 *                                         creating the user.
 * @param:  {Array}      nameArray         [{uid: ObjectId('id'), name:'test1'}, ...]
 * @return: {Function}                     Callback when done.
 */
Player.createCustomAccount = function(templateUid, nameArray, doneCb) {
    if (!Array.isArray(nameArray) || nameArray.length === 0 ||
        typeof templateUid !== 'string' || templateUid.length !== 24) {
        throw new Error('Bad params.');
    }

    async.waterfall(
        [
          function(cb) {
              PlayerModel.findOne({uid : templateUid}, cb);
          },

          function(doc, cb) {
              if (!doc) {
                  cb(new Error('Failed to find ' + templateUid));
                  return;
              }
              var count = 0;
              var saveNewDoc = function(theDoc, callback) {
                  theDoc._id = new mongoose.Types.ObjectId();
                  theDoc.uid = nameArray[count].uid;
                  theDoc.userName = nameArray[count].name;
                  theDoc.data.nickName = nameArray[count].name;
                  theDoc.isNew = true;
                  theDoc.save(function(err) {
                      if (err) {
                          console.info('Failed to create ' +
                                       nameArray[count].name + '. err is ' +
                                       err.message);
                      }
                      if (++count < nameArray.length) {
                          saveNewDoc(theDoc, callback);
                      } else {
                          callback();
                      }
                  });
              };

              saveNewDoc(doc, cb);
          }
        ],
        function(err) {
            if (err) {
                console.info(err.message);
            }
            doneCb(err);
        }
    );
};

Player.remove = function(cond, cb){
    PlayerModel.remove(cond, cb);
};

