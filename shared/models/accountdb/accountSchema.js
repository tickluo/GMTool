var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var accountSchema = new Schema({
    uid: {
        type: String,
        required: true
    },
    openId: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: false
    },
    isRobot: {
        type: Boolean,
        required: true
    },
    platform: {
        type: String,
        required: false
    },
    ipAddr: {
        type: String,
        required: true
    },
    operator: {
        type: String,
        required: false
    },
    clusters: {
        type: [Number],
        required: false,
        default: []
    },
    date: {
        type: Date,
        default: Date.now
    }
}, {
    strict: false,
    autoIndex: false,
    collection: 'account',
    minimize: false
});

// Create index for openId.
accountSchema.index({
    openId: 1
}, {
    unique: true
});

// Create index for userName.
accountSchema.index({
    userName: 1
}, {
    unique: true
});

// Create index for uid.
accountSchema.index({
    uid: 1
}, {
    unique: true
});

module.exports = accountSchema;
