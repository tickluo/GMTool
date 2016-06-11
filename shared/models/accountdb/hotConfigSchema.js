var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var versionSchema = new Schema({
    qaVer: {
        type: String,
        required: true,
        default: ""
    },
    curr: {
        type: String,
        required: true
    },    
    min: {
        type: String,
        required: true
    },    
    fullUrl: {
        type: String,
        required: true
    },    
    updateInfo: {
        type: Schema.Types.Mixed,
        required: true,
        default: {}
    }
});


////////////////////////////////////////////////////////////////////////////////
/// HotConfig schema.
//////
var hotConfigSchema = new Schema({
    news: [
        {
            title: {
                type: String,
                required: true
            },
            content: {
                type: String,
                required: true                
            }
        }
    ],
    appleReview: {
        type: String,
        required: true,
        default: ''
    },    
    versionInfo: {
        'iOS-zhuopai': {
            type: versionSchema,
            required: false
        },
        'iOS-garena': {
            type: versionSchema,
            required: false
        },
        'Android-zhuopai-zhuopai': {
            type: versionSchema,
            required: false
        },
        'Android-garena-standalone': {
            type: versionSchema,
            required: false
        },
        'Android-garena-google': {
            type: versionSchema,
            required: false
        }
    }
}, {
    strict: true,
    autoIndex: false,
    collection: 'hotConfig',
    minimize: true
});

module.exports = hotConfigSchema;
