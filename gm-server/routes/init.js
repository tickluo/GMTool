var express = require('express');
var router = express.Router();
var security = require('../../shared/security.js');
var request = require('request');
var async = require('async');
var account = require('../lib/models/account');
var setting = require('../lib/models/setting');
var globalVar = require('../lib/globalVariable');

router.get('/setting',function(req, res){
    return res.send(globalVar.isAccountServerSet());
});

router.post('/setup', function (req, res) {
    var data = req.body;
    console.log('setup 1');
    console.log(data);

    var url = 'https://' + data.host + ':' + data.port;
    async.waterfall([
        function (cb) {
            console.log('setup 2');
            /* step 1 : add admin user name add password
             {
             userName: data.admin,
             password: data.password,
             email: data.email,
             emailPwd: data.emailPwd,
             SMTP: SMTP
             }*/
            account.register({
                userName: data.admin,
                password: data.password,
                role: 'Admin'
            }, function (err) {
                cb(err);
            });
        },
        function (cb) {
            console.log('setup 3');
            setting.save('accSvrURL', url, cb);
        }
    ], function (err) {

        if (err) {
            console.log('setup error');
            res.send({success: false, msg: 'setting failed'});
        } else {
            console.log('setup success');
            globalVar.setAccountServer(url);
            globalVar.initialize();
            /*res.send('/users/login');*/
            res.status(200).send({success: true})
        }
    });
});

router.post('/step2', function (req, res) {
    // need to check the server validation
    res.render('init', router.emptyData());
});

// step 3 : create moon robot( move this to the deploy server step...)
router.post('/step3', function (req, res) {
    var data = req.body;
    var robotCount = 3000;
    var astPort = 3101;
    var actPort = 3002;
    var accSvrURL = "https://" + data.accSrv + ':' + actPort + '/moonRobotCreate';
    var astSvrURL = "https://" + data.astSrv + ':' + astPort + '/moonRobotCreate';

    var createRobotAccount = function (callback) {
        request.post({
            url: accSvrURL,
            ca: security.tlsCa,
            key: security.tlsKey,
            cert: security.tlsCert,
            form: {robotCount: robotCount}
        }, function (e, r, httpBody) {
            if (e) {
                console.log(1);
                callback(e);
                return;
            }
            if (r.statusCode !== 200) { // HTTP OK
                console.log(2);
                callback(new Error('Bad status code ' + r.statusCode + '. body is ' + httpBody));
                return;
            }
            var body = JSON.parse(httpBody);
            if (body.code !== 200 || !body.data) {
                console.log(3);
                callback(new Error('Bind failed. Body is ' + httpBody));
                return;
            }
            callback(e, body);
        });
    };

    var createRobotHero = function (callback, accountData) {
        request.post({
            url: astSvrURL,
            ca: security.tlsCa,
            key: security.tlsKey,
            cert: security.tlsCert,
            form: accountData
        }, function (e, r, httpBody) {
            if (e) {
                console.log(4);
                callback(e);
                return;
            }
            if (r.statusCode !== 200) { // HTTP OK
                console.log(5);
                callback(new Error('Bad status code ' + r.statusCode + '. body is ' + httpBody));
                return;
            }
            callback(e, httpBody);
        });
    };

    async.waterfall(
        [
            function (cb) {
                createRobotAccount(cb);
            },

            function (accountData, cb) {
                createRobotHero(cb, accountData);
            }
        ],
        function (err) {
            if (!!err) {
                res.send('error:' + JSON.stringify(err));
            }
            else {
                res.send("done");
            }
        }
    );
});

router.emptyData = function () {
    var data = {};
    data.title = "Setup";
    data.message = "";
    return data;
};

module.exports = router;
