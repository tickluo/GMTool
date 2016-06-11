var mongoose = require('mongoose');
var Schema = mongoose.Schema;

////////////////////////////////////////////////////////////////////////////////
/// Player log schema.
//////
var playerLogSchema =
    new Schema(
        {
          uid : {type : String, required : true},
          userName : {type : String, required : true},
          logType : {type : String, required : true},
          date : {type : Date, required : true, default : Date.now},
          body : {
              login: {
                  logout: {type: Date, required: false},
                  platform: {type: String, required: false},
                  loginType: {type: String, required: false},
                  ip : {type : String, required : false}
              },
              enterLevel : {levelId : {type : String, required : false}},
              recharge : {
                  rechargeId : {type : String, required : false},
                  cash : {type : Number, required : false},
                  realMoney : {type : Number, required : false},
                  rechargeTimes : {type : Number, required : false},
                  platform : {type : String, required : false}
              },
              buyItem : {
                  txnId : {type : String, required : false},
                  itemId : {type : String, required : false},
                  quantity : {type : Number, required : false},
                  totalCost: {type: Number, required: false}
              },
              sendPoint : {
                  txnId : {type : String, required : false},
                  reason : {type : String, required : false},
                  amount : {type : Number, required : false}
              },
              goldFinger: {
                  price: {type: Number, required: false},
                  amount: {type: Number, required: false}
              },
              changeNickName: {
                  oldName: {type: String, required: false},
                  newName: {type: String, required: false}                  
              }
          }
        },
        {
          strict : true,
          autoIndex : false,
          collection : 'playerLog',
          minimize : true
        }
    );

// Create index.
playerLogSchema.index({userId : 1}, {unique : false});

playerLogSchema.index({userName : 1}, {unique : false});

playerLogSchema.index({logType : 1}, {unique : false});

playerLogSchema.index({'body.login.logout' : 1}, {unique : false});
playerLogSchema.index({'body.login.platform' : 1}, {unique : false});
playerLogSchema.index({'body.login.loginType' : 1}, {unique : false});

playerLogSchema.index({'body.enterLevel.levelId' : 1}, {unique : false});

playerLogSchema.index({'body.buyItem.itemId' : 1}, {unique : false});

playerLogSchema.index({'body.buyItem.txnId' : 1}, {unique : false});

module.exports = playerLogSchema;
