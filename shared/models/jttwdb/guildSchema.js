var mongoose = require('mongoose');
var Schema = mongoose.Schema;

////////////////////////////////////////////////////////////////////////////////
/// Guild schema.
//////
var guildSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    notice: {
        type: String,
        default:""
    },
    announce: {
        type: String,
        default:""
    },
    icon: {
        type: String,
        default:""
    },
    active:{
        type: Number,
        default:0
    },
    memberCount:{
    type: Number,
    default:0
    },
    // 0 : free to join, 1 : need apply check
    join:{
        type: Number, default:0
    },
    //reqLevel
    reqLevel:{
        type: Number, default:20
    },
    // uid
    chairman: {
        type: String,
        required: true
    },
    // uid
    elders:[{
        type: String,
        required: true
    }],
    // guild members, uid
    members:[{
        type: String,
        required: true
    }],
    // request to join guild list, uid
    requests:[{
        type: String,
        required: true
    }],
    // logs
    logs:[{
        type:{ type: String, default:0}, // operation type
        date:{ type: Number, default: Date.now() },
        name: { type: String, required:true},
        _id: false }
    ],
    // who pass treasureCave Level
    /* treasureCave:{
        totalPassTimes:{caveType:passTimes,...,...},
        todayPlayTimes:{caveType:{userId:times}, ...}, // how many times the user play today
    }
    */
    treasureCave: {type:Schema.Types.Mixed, required: false, default: {}},
    // for energy give
    /*
        energy{
            give:{
                A:{B:1,C:1,D:1}
            },
            get:{
                A:{B:0/1} //0:not get yet, 1:already get
            }
        }
     */
    energy:{type:Schema.Types.Mixed, required: true, default: {}},
    /*
    stove activity:
    {
        refine:{uid:{id:xxx, startTime:xxx}, ...},//uid:user id, id:magic id
        attr:{level:xxx,exp:xxx,maxExp:xxx}
    }
     */
    stove:{type:Schema.Types.Mixed, required: true, default: {}},
    // use to store user info for common use.
    users:[{
        uid: { type: String, required:true},
        name: { type: String, required:true},
        icon: { type: String, default:''},
        level: { type: Number, required:true},
        login: { type: Number, required:true}, //last login time
        skill:{ type: Number, required:true, default:0},
        vip:{ type: Number, required:true, default:0},
        spirits:{type:Schema.Types.Mixed, required: true, default: {}}
    }],
    bossDamage:{type:Schema.Types.Mixed, required: true, default: {}},
    vitality: {
        total: { type: Number, required:true, default:0},
        period: { type: Number, required:true, default:0}
    },//{id:[{date:xxx,val:xxx}]}, max to 7days
    value:{type:Schema.Types.Mixed, required: true, default: {}},
    facility:{type:Schema.Types.Mixed, required: true, default: {}},
    facilityAward:{type:Schema.Types.Mixed, required: true, default: {}},
    donate:{type:Schema.Types.Mixed, required: true, default: {}}
}, {
    strict: true,
    autoIndex: false,
    collection: 'guild',
    minimize: false
});


////////////////////////////////////////////////////////////////////////////////
/// Create index.
//////
guildSchema.index({
    'name': 1
}, {
    unique: true
});

module.exports = guildSchema;

