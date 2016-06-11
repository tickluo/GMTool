var mongoose = require('mongoose');
var Schema = mongoose.Schema;

////////////////////////////////////////////////////////////////////////////////
/// game server data Archive schema.
//////
var archiveSchema = new Schema({
    typeName: {
        type: String,
        required: true
    },
    data: {
        type: Schema.Types.Mixed,
        required: true
    }
}, {
    strict: true,
    autoIndex: false,
    collection: 'archive'
});

module.exports = archiveSchema;
