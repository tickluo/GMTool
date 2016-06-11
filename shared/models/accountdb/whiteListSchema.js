var mongoose = require('mongoose');
var Schema = mongoose.Schema;

////////////////////////////////////////////////////////////////////////////////
/// White list schema.
//////
var whiteListSchema = new Schema({
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
    collection: 'whiteList',
    minimize: true
});

// Create index.
whiteListSchema.index({
    openId: 1
}, {
    unique: true
});

module.exports = whiteListSchema;
