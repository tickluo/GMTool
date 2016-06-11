var mongoose = require('mongoose');
var EventEmitter = require('events');

var DBConn = function () {
    this.db = null;
    this.eventReceiver = [];
    this.opened = false;
    this.errored = false;
};

var pro = DBConn.prototype;

pro.start = function(dbUrlStr) {
    this.db = mongoose.createConnection(dbUrlStr);

    if (!this.db) {
        throw new Error('connection failed');
    }

    this.db.on('error', this.onError.bind(this));
    this.db.once('open', this.onOpen.bind(this));
};

pro.registerEventReceiver = function(event) {
    if (!(event instanceof EventEmitter)) {
        throw new Error('Bad event');
    }

    this.eventReceiver.push(event);
    var self = this;
    
    if (this.opened) {
        process.nextTick(function() {
            event.emit('open', null, self);
        });
    }
};

pro.onOpen = function () {
    this.opened = true;
    
    for (var i = 0; i < this.eventReceiver.length; ++i) {
        this.eventReceiver[i].emit('open', null, this);
    }
};

pro.onError = function (err) {
    this.opened = true;

    for (var i = 0; i < this.eventReceiver.length; ++i) {
        this.eventReceiver[i].emit('error', err);
    }
};

module.exports = DBConn;
