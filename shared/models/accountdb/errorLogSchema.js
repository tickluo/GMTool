var mongoose = require('mongoose');
var Schema = mongoose.Schema;

////////////////////////////////////////////////////////////////////////////////
/// Error log schema.
//////
var errorLogSchema = new Schema({
    uid: {
        type: String,
        required: false
    },
    openId: {
        type: String,
        required: false
    },
    errType: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    body: {
        bindGuest: {
            clusterId: {
                type: Number,
                required: false
            },
            oldOpenId: {
                type: String,
                required: false
            },
            newOpenId: {
                type: String,
                required: false
            }
        }
    }
}, {
    strict: true,
    autoIndex: false,
    collection: 'errorLog',
    minimize: true
});

// Create index.
errorLogSchema.index({
    uid: 1
}, {
    unique: false
});

errorLogSchema.index({
    openId: 1
}, {
    unique: false
});

errorLogSchema.index({
    errType: 1
}, {
    unique: false
});

errorLogSchema.index({
    date: 1
}, {
    unique: false
});

module.exports = errorLogSchema;
