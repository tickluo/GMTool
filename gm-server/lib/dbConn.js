var mongoose = require('mongoose');
var cfg = require('../config/mongodb.json');
var logger = require('log4js').getLogger('app');
var EventEmitter = require('events');
var dbConfig = (process.env.NODE_ENV === 'production' ?
    cfg.production : cfg.development);


var DBConn = function () {
    this.db = null;
    this.eventReceiver = [];
    this.opened = false;
    this.errored = false;
};

var pro = DBConn.prototype;

pro.start = function() {
    this.db = mongoose.createConnection(dbConfig.gmdbUrl);
    if (!this.db) {
        throw new Error('DBConn create connection failed');
    }

    this.db.on('error', this.onError.bind(this));
    this.db.once('open', this.onOpen.bind(this));
};

pro.registerEventReceiver = function(event) {
    if (!(event instanceof EventEmitter)) {
        throw new Error('Bad event');
    }

    this.eventReceiver.push(event);

    if (this.opened) {
        process.nextTick(function() {
            event.emit('open');
        });
    }
};

pro.onOpen = function () {
    this.opened = true;

    logger.info('DBConn::onOpen: Mongo db connected successfully');

    for (var i = 0; i < this.eventReceiver.length; ++i) {
        this.eventReceiver[i].emit('open');
    }
};

pro.onError = function (err) {
    this.opened = true;

    logger.error('DBConn::onError: Mongo db connected error:' + err + ', check database exist???');

    for (var i = 0; i < this.eventReceiver.length; ++i) {
        this.eventReceiver[i].emit('error', err);
    }
};

var dbConn = new DBConn();
dbConn.start();

module.exports = dbConn;
