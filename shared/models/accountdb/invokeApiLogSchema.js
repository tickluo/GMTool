var mongoose = require('mongoose');
var Schema = mongoose.Schema;

////////////////////////////////////////////////////////////////////////////////
/// 
//////
var invokeApiLogSchema = new Schema({
    openId: {
        type: String,
        required: true
    },
    uid: {
        type: String,
        required: true
    },
    ip: {
        type: String,
        required: true
    },
    route: {
        type: String,
        required: true
    },
    params: {
        type: Schema.Types.Mixed,
        required: true,
        default: {}
    },
    result: { 
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
    collection: 'invokeApiLog'
});

// Create index.
invokeApiLogSchema.index({
    openId: 1
}, {
    unique: false
});

invokeApiLogSchema.index({
    uid: 1
}, {
    unique: false
});

invokeApiLogSchema.index({
    apiRoute: 1
}, {
    unique: false
});

invokeApiLogSchema.index({
    date: 1
}, {
    unique: false
});

module.exports = invokeApiLogSchema;
