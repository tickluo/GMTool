var ModelFactory = require('../modelFactory.js');
var util = require('util');
var dbConn = require('../dbConnFactory.js').getDefaultAccDBConn();
var accountSchema = require('./accountSchema.js');
var errorLogSchema = require('./errorLogSchema.js');
var garenaEventNotifySchema = require('./garenaEventNotifySchema.js');
var hotConfigSchema = require('./hotConfigSchema.js');
var invokeApiLogSchema = require('./invokeApiLogSchema.js');
var onlineUserStatSchema = require('./onlineUserStatSchema');
var qaOpenIdSchema = require('./qaOpenIdSchema.js');
var whiteListSchema = require('./whiteListSchema.js');

var AccountDBModelFactory = function () {
    ModelFactory.call(this);
};

util.inherits(AccountDBModelFactory, ModelFactory);

var pro = AccountDBModelFactory.prototype;

pro.createAllDefaultModels = function() {
    this.createDefaultModel(dbConn, 'AccountModel', accountSchema);
    this.createDefaultModel(dbConn, 'ErrorLogModel', errorLogSchema);
    this.createDefaultModel(dbConn, 'GarenaEventNotifyModel', garenaEventNotifySchema);
    this.createDefaultModel(dbConn, 'HotConfigModel', hotConfigSchema);
    this.createDefaultModel(dbConn, 'InvokeApiLogModel', invokeApiLogSchema);
    this.createDefaultModel(dbConn, 'OnlineUserStatModel', onlineUserStatSchema);
    this.createDefaultModel(dbConn, 'QaOpenIdModel', qaOpenIdSchema);    
    this.createDefaultModel(dbConn, 'WhiteListModel', whiteListSchema);
};

var factory = new AccountDBModelFactory();
factory.createAllDefaultModels();

module.exports = factory;
