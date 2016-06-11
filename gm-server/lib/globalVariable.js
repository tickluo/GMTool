/**
 * Created by zhongjie.zhang on 2016/3/17.
 */
var setting = require('./models/setting');
var util = require('./utility');
var info = module.exports;
var request = require('request');
var async = require('async');

info.accountServerURL = '';
info.astServerURLMap = {}; // key : id, value: URL
info.accSvrURLKey = 'accSvrURL';
info.isAccountServerSet = function(){
    return (!!info.accountServerURL);
};

info.setAccountServer = function(url){
    info.accountServerURL = url;
};

info.addAstServer = function(id, url){
    if(!!info.astServerURLMap[id]){
        delete info.astServerURLMap[id];
    }
    info.astServerURLMap[id] = url;
};

info.getAstServer = function(id) {
    return info.astServerURLMap[id];
};

info.initialize = function(){
    async.waterfall([
        function (cb) {
            setting.get(info.accSvrURLKey, function(err, doc){
                if(!err && !!doc && !!doc.v){
                    info.setAccountServer(doc.v);
                }
                cb(err);
            });
        },
        function (cb) {
            request.get(util.generatePostOption(info.accountServerURL + '/gm/server/list'),
                function(e, r, httpBody) {
                    if (e) {
                        cb(e);
                        return;
                    }

                    if (r.statusCode !== 200) { // HTTP OK
                        cb(new Error(
                            'Bad status code ' + r.statusCode + '. body is ' + httpBody));
                        return;
                    }

                    var body = JSON.parse(httpBody);

                    for(var i in body){
                        info.addAstServer(i, "https://" + body[i].private.hostForInternal + ':' + body[i].private.portForInternal );
                    }
                    cb(null);
                });
        }
    ], function (err) {

        if (err) {
        } else {
        }
    });
};

info.generateURL = function(url, addtional){
  return url + addtional;
};

