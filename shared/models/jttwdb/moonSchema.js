var mongoose = require('mongoose');
var Schema = mongoose.Schema;

////////////////////////////////////////////////////////////////////////////////
/// game server data MoonHistory schema.
//////
var historySchema = new Schema({
    p:{ type: String,  default:''}, // player nick name, enemy
    res:{ type: Number, default:0}, // result : 0:failed, 1:succeed
    rank:{ type: Number,  default:0}, // current rank
    preRank:{ type: Number, default:0},// previous rank
    def:{ type: Number, default:0} // 1:defense, 0:not defense
});
var moonSchema = new Schema({
    history:[historySchema],
    defense:{
        uid:{ type: String, required:true, default:''},
        level:{ type: Number,  default:0},
        nickName:{ type: String,  default:''},
        guildName:{ type: String, default:''},
        avatarId:{ type: Number,  default:0},
        isRobot:{ type: Number, default:0}, // 0:player, 1:robot
        spirits: [{
            type: Schema.Types.Mixed,
            required: true,
            default: {}
        }],
        max_rank:{ type: Number,  default:0},
        rank:{ type: Number,  default:0},
        skillId:{ type: Number, default:0}
    }
}, {
    strict: true,
    autoIndex: false,
    collection: 'moon'
});

moonSchema.index({'defense.uid' : 1}, {unique : true});

module.exports = moonSchema;

