var mongoose = require('mongoose');
var Schema = mongoose.Schema;

////////////////////////////////////////////////////////////////////////////////
/// Balance change record schema.
//////
var balanceChangeRecordSchema = new Schema({
    uid: {
        type: String,
        required: true
    },
    openId: {
        type: String,
        required: true
    },
    platform: {
        type: String,
        required: true
    },
    pointAmount: {
        type: Number,
        required: true
    },
    txnId: {
        type: String,
        required: true
    },
    txnType: {
        type: Number,
        required: true
    },
    channelName: {
        type: String,
        required: false
    },
    currency: {
        type: String,
        required: false
    },
    currencyAmount: {
        type: String,
        required: false
    },
    txnTimestamp: {
        type: Number,
        required: true
    },
    ip: {
        type: String,
        required: true
    },
    test: {
        type: Number,
        required: true,
        default: 0
    },
    processed: {
        type: Boolean,
        required: true,
        default: false
    },
    date: {
        type: Date,
        default: Date.now
    }
}, {
    strict: true,
    autoIndex: false,
    collection: 'balanceChangeRecord',
    minimize: true
});

// Create index.
balanceChangeRecordSchema.index({
    uid: 1
});

balanceChangeRecordSchema.index({
    openId: 1
});

balanceChangeRecordSchema.index({
    txnId: 1
}, {
    unique: true
});

balanceChangeRecordSchema.index({
    txnType: 1
});

module.exports = balanceChangeRecordSchema;
