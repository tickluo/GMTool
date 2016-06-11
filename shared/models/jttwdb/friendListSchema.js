var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var friendSchema = new Schema({
    uid:{
        type: String,
        required: true
    },
    friend:{
        type: Schema.Types.Mixed,
        required: true,
        default: {}
    },
    black:{
        type: Schema.Types.Mixed,
        required: true,
        default: {}
    },
    // request by others to add friend, key : uid, value : time
    approve:{
        type: Schema.Types.Mixed,
        required: true,
        default: {}
    },
    // request add friend, key : uid, value : time
    apply:{
        type: Schema.Types.Mixed,
        required: true,
        default: {}
    },
    // give energy to
    giveEnergy:{
        type: Schema.Types.Mixed,
        required: true,
        default: {}
    },
    // get energy from, 1:not gain, 2:already gain
    getEnergy:{
        type: Schema.Types.Mixed,
        required: true,
        default: {}
    },
    log:{
        type: Schema.Types.Mixed,
        required: true,
        default: {}
    }
}, {
    strict: true,
    autoIndex: false,
    collection: 'friendList'
});

module.exports = friendSchema;
