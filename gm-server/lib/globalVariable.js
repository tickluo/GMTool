/**
 * Created by zhongjie.zhang on 2016/3/17.
 */
var setting = require('./models/setting');
var account = require('./models/account');
var util = require('./utility');
var info = module.exports;
var request = require('request');
var async = require('async');


info.accountServerURL = '';
info.astServerURLMap = {}; // key : id, value: URL
info.accSvrURLKey = 'accSvrURL';
info.emailConfig = {}; //send email config{SMTP,}

info.isAccountServerSet = function () {
    return (!!info.accountServerURL);
};

info.setAccountServer = function (url) {
    info.accountServerURL = url;
};

info.setEmailConfig = function (config) {
    return !!config ? info.emailConfig = {
        host:config.SMTPHost,
        port:config.SMTPPort,
        connectionTimeout : "7000",
        greetingTimeout : "7000",
        /*secure: true,*/
        tls: {
            rejectUnauthorized:false
        },
        auth: {
            user: config.email,
            pass: config.emailPwd
        }
    } : false;
};


info.addAstServer = function (id, url) {
    if (!!info.astServerURLMap[id]) {
        delete info.astServerURLMap[id];
    }
    info.astServerURLMap[id] = url;
};

info.getAstServer = function (id) {
    return info.astServerURLMap[id];
};

info.initialize = function () {
    async.waterfall([
        function (cb) {
            setting.get(info.accSvrURLKey, function (err, doc) {
                if (!err && !!doc && !!doc.v) {
                    info.setAccountServer(doc.v);
                    info.setEmailConfig({
                        email: doc.email,
                        emailPwd: doc.emailPwd,
                        SMTPHost: doc.SMTPHost,
                        SMTPPort: doc.SMTPPort
                    });
                }
                cb(err);
            });
        },
        function (cb) {
            request.get(util.generatePostOption(info.accountServerURL + '/gm/server/list'),
                function (e, r, httpBody) {
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

                    for (var i in body) {
                        info.addAstServer(i, "https://" + body[i].private.hostForInternal + ':' + body[i].private.portForInternal);
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

info.generateURL = function (url, addtional) {
    return url + addtional;
};

