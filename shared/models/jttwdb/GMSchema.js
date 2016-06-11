/**
 * Created by user on 2015/5/25.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

////////////////////////////////////////////////////////////////////////////////
/// game server data GM schema.
//////

var GMSchema = new Schema({
    uid:{ type: String, required:true, default:''},
    lockTime:{ type: Number,  default:0},
    lock:{ type: Number,  default:0},
    mute:{ type: Number,  default:0},
    muteTime:{ type: Number,  default:0}
}, {
    strict: true,
    autoIndex: false,
    collection: 'GM'
});

GMSchema.index({'uid' : 1}, {unique : true});

module.exports = GMSchema;
