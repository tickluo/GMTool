var mongoose = require('mongoose');
var Schema = mongoose.Schema;

////////////////////////////////////////////////////////////////////////////////
/// QA open id schema.
//////
var qaOpenIdSchema = new Schema({
    openId: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    }
}, {
    strict: true,
    autoIndex: false,
    collection: 'qaOpenId',
    minimize: true
});

// Create index.
qaOpenIdSchema.index({
    openId: 1
}, {
    unique: true
});

module.exports = qaOpenIdSchema;
