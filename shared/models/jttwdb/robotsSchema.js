var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var robotsSchema = new Schema({
    key: String,
    uidArr: [String]
}, {
    strict: true,
    autoIndex: false,
    collection: 'robots'
});

module.exports = robotsSchema;
