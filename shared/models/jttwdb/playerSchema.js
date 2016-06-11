var mongoose = require('mongoose');
var Schema = mongoose.Schema;

////////////////////////////////////////////////////////////////////////////////
/// Generate garbage string to prevent mongodb move data.
//////
function createLongString(max_length) {
    var x = "1234567890";
    var iterations = 1000000;
    for (var i = 0; i < iterations; i++) {
        x += x.concat(x);
        if (x.length >= max_length) {
            break;
        }
    }
    x = x.slice(0, max_length);
    return x;
}

var garbage_str = createLongString(50 * 1024); // 50KB string.

////////////////////////////////////////////////////////////////////////////////
/// Player schema.
//////
var playerSchema = new Schema({
    uid: {
        type: String,
        required: true
    },
    nuid: { // Number user id.
        type: Number,
        required: true
    },
    openId: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    dataRev: {
        type: Number,
        required: true,
        default: 0
    },
    isRobot: {
        type: Number,
        required: false,
        default: 0
    },
    // Data field reversion.
    /* Data:
     * {
     *     areaId: 1,
     *     items: {id1: {count:12}, ...},
     *     magics: {id1: {count:12 }, ...}, // spirit magics and materials
     *     avatarId :xxx,
     *     level:xxx,
     *     levelUpdate:xxx,
     *     nickName:xxx,
     *     exp:xxx,
     *     equipments:{"shoes": {"id": 1, "enhance":1}, ...},
     *     skills:{id1:1,id2:1,...}, // key : the skill id, value : must be 1
     *     levels:{id1:{result:xxx,times:xxx}, ...}, // story level records
     *     levelChapters:{id1:xxx, id2:xxx,...}, //chapter times
     *     FELevels:{passes:{id1:1, id2:1}, current:{times:0,prevTime:xxx}}, // which FE level passes and the pass info today, prevPassTime is UTC time
     *     towerData:{ progress:{} }
     *     towerLevelTime:utcTime // last tower level pass time:UTC time
     *     achieve:{id1:1,id2:0} // achievement system data, key : achievement id, value : param
     *     achieveDone:{id1:1,id2:0} // achievement has done, key : achievement id, value : 0-award not got, 1-award got
     *     daily:{id1:xxx,id2:xxx}// daily task system data, key : daily task id, value : param
     *     dailyDone:{id1:1,id2:0} // daily has done, key : daily task id, value : 0-award not got, 1-award got
     *     dailyCheckTime:check time // daily check time, utc time
     *     energy: {count: 1, lastRevive: 1425956264123, buyTimes: 1, lastReset: 1425956264123},
     *     goldFinger: {buyTimes: 0, lastReset: 1425956264123},
     *     activity:{activityId:{val:xxx,times:xxx,awards:xxx},
     *     guideStep:0,
     *     lockBtnList:"", // string
     *     moon:{times:0,prevTime:0,resetTime:0,totalTimes:0,totalWinTimes:0}
     *     spirits: {
     *         id:{
     *             id:xxx,
     *             level:xxx,
     *             exp:xxx,
     *             quality:xxx,
     *             qualityLevel:xxx,
     *             discipline:xxx,
     *             awake:0 // 0:not awake yet, 1:already awake
     *             magic:{1:1, ...}, // {magic id:1, ...} // key: slot, value 1 means equipped, for later use.
     *         },...,
     *     },
     *     recharge: {
     *         times: 1,       // The times the player recharged.
     *         cash: 100,      // Total cash.
     *         vipExp: 100,    // Experience of VIP.
     *         bonus: {"1": 0, "2": 1, "3", "1"}
     *     },
     *     divine: {
     *      pay1:{free:n, prevTime:xxx, N:xxx,first:{free:0/1,oneTime:0/1,tenTime:0/1}},
     *      pay2:{free:n, prevTime:xxx, N:xxx,first:{free:0/1,oneTime:0/1,tenTime:0/1}},
     *      vip:{free:n, prevTime:xxx, N:xxx,first:{free:0/1,oneTime:0/1,tenTime:0/1}},
     *     },
     *     signin:{times:n, prevTime: date time} // times will be reset at new month,
     *     levelResetTime:123123 // last reset time, use to check if need reset today
     *     blackStore: { cd: 123444, start: 111123, end: 222222},
     *     boss:{times:0, prevTime:xxx}，
     *     unlockTime: // if unlockTime is not 0, player cannot login before this time.
     *     vipBonus: {1: 1, 2: 1} // Mark vip bonus has been received.
     *     memberCard: {'30': {expire: '2016-12-03'}, unlimited: 1}
     * }
     */
    data: {
        areaId: {
            type: String,
            required: true,
            default: '1'
        },
        recharge: {
            times: {
                type: Number,
                required: true,
                default: 0
            },
            cash: {
                type: Number,
                required: true,
                default: 0
            },
            vipExp: {
                type: Number,
                required: true,
                default: 0
            },
            bonus: {
                type: Schema.Types.Mixed,
                required: true,
                default: {}
            }
        },
        signin: {
            state: {
                type: Number,
                required: true,
                default: 0
            },
            times: {
                type: Number,
                required: true,
                default: 0
            },
            prevTime: {
                type: Number,
                required: true,
                default: 0
            }
        },
        avatarId: {
            type: String,
            required: true
        },
        level: {
            type: Number,
            required: true,
            default: 1
        },
        levelUpdate: {
            type: Number,
            required: true,
            default: 0
        },
        nickName: {
            type: String,
            required: true
        },
        exp: {
            type: Number,
            required: true,
            default: 0
        },
        towerLevelTime: {
            type: Number,
            required: true,
            default: 0
        },
        energy: {
            count: {
                type: Number,
                required: true,
                default: 0
            },
            lastRevive: {
                type: Number,
                required: true,
                default: 0
            },
            lastReset: {
                type: Number,
                required: true,
                default: 0
            },
            buyTimes: {
                type: Number,
                required: true,
                default: 0
            }
        },
        goldFinger: {
            lastReset: {
                type: Number,
                required: true,
                default: 0
            },
            buyTimes: {
                type: Number,
                required: true,
                default: 0
            }
        },
        guideStep: {
            type: Number,
            required: true,
            default: 0
        },
        lockBtnList:{
            type: String,
            required: false
        },
        runes:{
            type: Schema.Types.Mixed,
            required: true,
            default: {}
        },
        runeEquips:{
            type: Schema.Types.Mixed,
            required: true,
            default: {}
        },
        towerData: {
            type: Schema.Types.Mixed,
            required: true,
            default: {}
            //challenge: {type: Number, required: true, default: 1},
            //passDiff1: {type: Boolean, required: true, default: false},
            //progress:{}
        },
        equipments: {
            type: Schema.Types.Mixed,
            required: true,
            default: {}
        },
        skills: {
            type: Schema.Types.Mixed,
            required: true,
            default: {}
        },
        levels: {
            type: Schema.Types.Mixed,
            required: true,
            default: {}
        },
        achieve: {
            type: Schema.Types.Mixed,
            required: true,
            default: {}
        },
        achieveDone: {
            type: Schema.Types.Mixed,
            required: true,
            default: {}
        },
        daily: {
            type: Schema.Types.Mixed,
            required: true,
            default: {}
        },
        dailyDone: {
            type: Schema.Types.Mixed,
            required: true,
            default: {}
        },
        dailyCheckTime: {
            type: Number,
            required: false,
            default: 0
        },
        activity: {
            type: Schema.Types.Mixed,
            required: true,
            default: {}
        },
        items: {
            type: Schema.Types.Mixed,
            required: true,
            default: {}
        },
        magics: {
            type: Schema.Types.Mixed,
            required: true,
            default: {}
        },
        spirits: {
            type: Schema.Types.Mixed,
            required: true,
            default: {}
        },
        divine: {
            type: Schema.Types.Mixed,
            required: true,
            default: {}
        },
        vitality: [{
            type: Schema.Types.Mixed,
            required: true,
            default: {}
        }],
        login: {
            prevTime: {
                type: Number,
                required: false,
                default: 0
            },
            coTimes: {
                type: Number,
                required: false,
                default: 0
            }
        },
        guild: {
            id: {
                type: String,
                required: false,
                default: ''
            },
            quit: {
                type: Number,
                required: false,
                default: 0
            },
            facility:{
                type: Schema.Types.Mixed,
                required: true,
                default: {}
            }
        },
        moon: {
            resetCDTimes: {
                type: Number,
                required: false,
                default: 0
            },
            resetTimes: {
                type: Number,
                required: false,
                default: 0
            },
            times: {
                type: Number,
                required: false,
                default: 0
            },
            prevTime: {
                type: Number,
                required: false,
                default: 0
            },
            totalTimes: {
                type: Number,
                required: false,
                default: 0
            },
            totalWinTimes: {
                type: Number,
                required: false,
                default: 0
            }
        },
        wingLevel: {
            type: Number,
            required: true,
            default: 0
        },
        bindSpiritId: {
            type: String,
            required: false,
            default: ''
        },
        levelResetTime: {
            type: Number,
            required: false,
            default: 0
        },
        chapterPassTimes: {
            type: Schema.Types.Mixed,
            required: true,
            default: {}
        },
        blackStore: {
            cd: {
                type: Number,
                required: true,
                default: 0                
            },
            start: {
                type: Number,
                required: true,
                default: 0                
            },
            end: {
                type: Number,
                required: true,
                default: 0
            }
        },
        totem:{
            type:Schema.Types.Mixed, 
            required: true, 
            default: {}
        },
        memberCard:
        {
            type:Schema.Types.Mixed, 
            required: true, 
            default: {}            
        },
        boss:
        {
            type:Schema.Types.Mixed,
            required: true,
            default: {}
        },
        rank: {
            type:Schema.Types.Mixed,
            required: true,
            default: {}
        },
        iconName:
        {
            type: String,
            required: false,
            default: ''
        },
        frameName:
        {
            type: String,
            required: false,
            default: ''
        },
        loginGift:
        {
            lastGetTime: {
                type: Number,
                required: true,
                default: 0
            },
            totalTimes: {
                type: Number,
                required: true,
                default: 0
            }
        },
        vipBonus: {
            type: Schema.Types.Mixed,
            required: true,
            default: {}
        }
    },
    dump: {
        type: String,
        required: false,
        default: garbage_str
    },
    date: {
        type: Date,
        default: Date.now
    }
}, {
    strict: true,
    autoIndex: false,
    collection: 'player',
    minimize: false
});

////////////////////////////////////////////////////////////////////////////////
/// Create index.
//////
playerSchema.index({uid : 1}, {unique : true});
playerSchema.index({nuid : 1}, {unique : true});
playerSchema.index({openId : 1});

playerSchema.index({userName : 1}, {unique : true});

playerSchema.index({'data.nickName' : 1}, {unique : true});

playerSchema.index({'data.level' : 1});
playerSchema.index({'data.levelUpdate' : 1});

module.exports = playerSchema;
