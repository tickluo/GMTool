var Code = require('../../code');
var GuildModel = require('./jttwdbModelFactory.js').getModel('GuildModel');
var Guild = module.exports;

////////////////////////////////////////////////////////////////////////////////
/// Api Implementation.
//////
Guild.createNew = function (name, icon, creator, cb) {
    var guild = new GuildModel({
        name:name,
        icon:icon,
        notice:'',
        chairman:creator.uid,
        elders:[],
        members:[],
        logs:[],
        requests:[],
        active:0,
        join:0, //0:free to join, 1:must agree by guild manager.
        users:[],
        memberCount:1,
        vitality:{total:0,period:0},
        value:{}, //uid:xxx,... contribution value
        facility:{}, // faName:{exp:xxx,level:xxx}, ...
        facilityAward:{}, // uid:{faName:times,...},...
        donate:{}//uid:times
    });

    guild.members.push(creator.uid);
    guild.users.push(creator);
    guild.stove = {attr:{level:1, exp:0, maxExp:0}, refine:{}};

    guild.save(
        function (err, doc) {
            if (!!err) {
                cb(err, {
                    code: Code.Guild.FA_DUIPLICATE_GUILD_NAME
                });
                return;
            }
            cb(null, doc);
        }
    );
};

Guild.saveGuild = function (guildInfo, cb) {
    this.getGuild(guildInfo._id, function (err, doc) {
        if (!!doc) {
            GuildModel.findOneAndUpdate({
                    _id: guildInfo._id
                }, {
                    $set:guildInfo
                }, {
                    upsert: true
                },
                function (err, doc) {
                    cb(err, doc);
                });
        }
        else{
            cb(new Error("Guild::saveGuild: Failed to find guild: " + guildInfo._id), doc);
        }
    });
};

Guild.reset = function (cb) {
    var conditions = {};
    var update = {$set:{'treasureCave.todayPlayTimes':{}, 'energy.give':{}, 'energy.get':{}, 'facilityAward':{}, 'donate':{}}};
    var options = {multi: true};
    GuildModel.update(conditions, update, options, function (err) {
        cb(err);
    });
};

Guild.saveGuild = function (guildInfo, cb) {
    this.getGuild(guildInfo._id, function (err, doc) {
        if (!!doc) {
            GuildModel.findOneAndUpdate({
                    _id: guildInfo._id
                }, {
                    $set:guildInfo
                }, {
                    upsert: true
                },
                function (err, doc) {
                    cb(err, doc);
                });
        }
        else{
            cb(new Error("Guild::saveGuild: Failed to find guild: " + guildInfo._id), doc);
        }
    });
};

Guild.getGuildByName = function (name, callback) {
    GuildModel.findOne({
        name: name
    }, function (err, doc) {
        if (!!doc) {
            callback(null, doc);
        } else {
            if (!err) {
                err = new Error("Guild::getGuildByName: Failed to find guild: " + name);
            }
            callback(err);
        }
    });
};


Guild.getGuild = function (objId, callback) {
    GuildModel.findOne({
        _id: objId
    }, function (err, doc) {
        if (!!doc) {
            callback(null, doc);
        } else {
            if (!err) {
                err = new Error("Guild::getGuild: Failed to find guild: " + objId);
            }
            callback(err);
        }
    });
};

Guild.remove = function(objId, callback){
    GuildModel.remove({_id: objId}, function(err, result){
        callback(err, result);
    });
};

Guild.getAllGuild = function(callback){
    GuildModel.find({}, null, {sort: { active: 1} }, function (err, docs) {
        callback(err, docs);
    });
};

Guild.getTopActive = function(top, maxMember, callback){
    GuildModel.find({'memberCount': {$lt: maxMember}}, null, {sort: { active: 1} }, function (err, docs) {
        callback(err, docs);
    });
};
