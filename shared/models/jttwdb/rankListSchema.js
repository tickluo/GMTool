/**
 * Created by user on 2015/6/8.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var rankListSchema = new Schema({
    rankId: {
        type: String,
        required: true
    },
    uid: {
        type: String,
        required: true
    },
    level:{ type: Number, required:true, default:0},
    nickName:{ type: String, required:true, default:''},
    iconName:{ type: String, default:''},
    rank:{ type: Number, required:true, default:0},
    val:{ type: Number, required:true, default:0},
    prev_rank:{ type: Number, required:true, default:0},
    prev_val:{ type: Number, required:true, default:0},
    avatarId:{ type: Number, required:true, default:0},
    guildId:{ type: String,  default:''},
    max_rank:{ type: Number, default:0}
}, {
    strict: true,
    autoIndex: false,
    collection: 'rankList'
});

module.exports = rankListSchema;
