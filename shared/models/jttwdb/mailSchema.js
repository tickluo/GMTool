var mongoose = require('mongoose');
var Schema = mongoose.Schema;

////////////////////////////////////////////////////////////////////////////////
/// Player mail schema.
//////
var mailSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    /**
     * {
     *   bodyId: 1, // bodyId and body&title&attachment are mutual excusive.
     *   body: '',
     *   title: '',
     *   attachment: {items:{'1': 5, '2': 10}, magics: {'1':1}, spirits: {'2': 2}},
     *   params: '', // optional
     *   read: false,
     *   taken: false,
     *   sent: unixtime,
     *   expire: unixtime
     * }
     */
    mails: {
        type: Schema.Types.Mixed,
        required: true
    }
}, {
    strict: true,
    autoIndex: false,
    collection: 'mail'
});

// Create index.
mailSchema.index({
    userId: 1
}, {
    unique: true
});

module.exports = mailSchema;
