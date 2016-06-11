var ModelFactory = require('../modelFactory.js');
var util = require('util');
var dbConn = require('../dbConnFactory.js').getDefaultJttwDBConn();

var archiveSchema = require('./archiveSchema.js');
var balanceChangeRecordSchema = require('./balanceChangeRecordSchema.js');
var guildSchema = require('./guildSchema.js');
var mailSchema = require('./mailSchema.js');
var moonSchema = require('./moonSchema.js');
var playerSchema = require('./playerSchema.js');
var playerLogSchema = require('./playerLogSchema.js');
var gmSchema = require('./GMSchema.js');
var rankListSchema = require('./rankListSchema.js');
var friendSchema = require('./friendListSchema.js');
var robotsSchema = require('./robotsSchema.js');

var JttwDBModelFactory = function () {
    ModelFactory.call(this);
};

util.inherits(JttwDBModelFactory, ModelFactory);

var pro = JttwDBModelFactory.prototype;

pro.createAllDefaultModels = function() {
    // Game server.
    this.createDefaultModel(dbConn, 'ArchiveModel', archiveSchema);
    this.createDefaultModel(dbConn, 'BalanceChangeRecordModel', balanceChangeRecordSchema);
    this.createDefaultModel(dbConn, 'GMModel', gmSchema);    
    this.createDefaultModel(dbConn, 'GuildModel', guildSchema);
    this.createDefaultModel(dbConn, 'MailModel', mailSchema);
    this.createDefaultModel(dbConn, 'MoonModel', moonSchema);    
    this.createDefaultModel(dbConn, 'PlayerModel', playerSchema);
    this.createDefaultModel(dbConn, 'PlayerLogModel', playerLogSchema);
    this.createDefaultModel(dbConn, 'RankListModel', rankListSchema);
    this.createDefaultModel(dbConn, 'FriendModel', friendSchema);

    // Ast server.
    this.createDefaultModel(dbConn, 'RobotsModel', robotsSchema);
};

var factory = new JttwDBModelFactory();
factory.createAllDefaultModels();

module.exports = factory;
