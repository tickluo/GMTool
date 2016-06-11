var mongoose = require('mongoose');
var Schema = mongoose.Schema;

////////////////////////////////////////////////////////////////////////////////
/// Error log schema.
//////
var onlineUserStatSchema = new Schema({
    sid: {
        type: Number,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    iOS: {
        type: Number,
        required: true
    },
    Android: {
        type: Number,
        required: true
    },
    loginType: {
        garena: {
            type: Number,
            required: false
        },
        facebook: {
            type: Number,
            required: false
        },
        zhuopai: {
            type: Number,
            required: false
        },
        guest: {
            type: Number,
            required: false
        },
        unknown: {
            type: Number,
            required: false
        }
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    }
}, {
    strict: true,
    autoIndex: false,
    collection: 'onlineUserStat',
    minimize: true
});

// Create index.
onlineUserStatSchema.index({
    sid: 1
}, {
    unique: false
});

onlineUserStatSchema.index({
    total: 1
}, {
    unique: false
});

onlineUserStatSchema.index({
    iOS: 1
}, {
    unique: false
});

onlineUserStatSchema.index({
    Android: 1
}, {
    unique: false
});

onlineUserStatSchema.index({
    'loginType.garena': 1
}, {
    unique: false
});

onlineUserStatSchema.index({
    'loginType.facebook': 1
}, {
    unique: false
});

onlineUserStatSchema.index({
    'loginType.zhuopai': 1
}, {
    unique: false
});

onlineUserStatSchema.index({
    'loginType:guest': 1
}, {
    unique: false
});

onlineUserStatSchema.index({
    'loginType:unknown': 1
}, {
    unique: false
});

module.exports = onlineUserStatSchema;
