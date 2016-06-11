var mongoose = require('mongoose');
var Schema = mongoose.Schema;

////////////////////////////////////////////////////////////////////////////////
/// Event notify schema.
//////
var eventNotifySchema = new Schema({
    openId: {
        type: String,
        required: true
    },
    txnId: {
        type: String,
        required: true
    },    
    result: {
        type: Number, // 0, unhandled. 1 success. -1 failed.
        required: true,
        default: 0
    },    
    reason: {
        type: String,
        required: false
    },
    data: {
        type: Schema.Types.Mixed,
        required: true,
        default: {}
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    }
}, {
    strict: true,
    autoIndex: false,
    collection: 'garenaEventNotify',
    minimize: true
});

// Create index.
eventNotifySchema.index({
    openId: 1
}, {
    unique: false
});

eventNotifySchema.index({
    txnId: 1
}, {
    unique: false
});

eventNotifySchema.index({
    result: 1
}, {
    unique: false
});

module.exports = eventNotifySchema;
