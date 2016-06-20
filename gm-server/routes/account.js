var express = require('express');
//var Player = require('../../shared/models/jttwdb/player');
var router = express.Router();
//var dataApi = require("../../game-server/app/util/dataApi.js");
var Code = require("../../shared/code");
var Promise = require("bluebird");
var request = require('request');
var globalVar = require('../lib/globalVariable');
var accountModel = require('../lib/models/account');
var util = require('../lib/utility');

/*router.get('/', function(req, res) {
 res.sendFile(req.app.locals.dirName + '/MetroTheme/page_account.html');
 });*/

router.get('/getAccounts', function (req, res) {
    /*accountModel.testInsert();*/
    var resData = {};
    //TODO:dismantle redundancy;
    if (req.query.query) {
        accountModel.getAccounts(req.query)
            .then(function (data) {
                return resData.data = data;
            })
            .then(function () {
                accountModel.getAccountNum(req.query)
                    .then(function (data) {
                        resData.AllRecordCount = data;
                        return res.status(200).send(resData);
                    });
            })
            .catch(function (err) {
                res.status(500).send(err)
            });
    }
    else {
        accountModel.getAllAccounts(req.query)
            .then(function (data) {
                return resData.data = data;
            })
            .then(function () {
                accountModel.getAccountNum()
                    .then(function (data) {
                        resData.AllRecordCount = data;
                        return res.status(200).send(resData);
                    });
            })
            .catch(function (err) {
                res.status(500).send(err)
            })

    }
});

router.post('/authAccount', function (req, res) {
    accountModel.updateAccount(req.body.uid, {role: 'Operator'})
        .then(function (data) {
            res.status(200).send({});
        })
        .catch(function (err) {
            res.status(500).send(err);
        })
});

router.post('/blockAccount', function (req, res) {
    accountModel.updateAccount(req.body.uid, {blocked: req.body.blocked})
        .then(function (data) {
            res.status(200).send({});
        })
        .catch(function (err) {
            res.status(500).send(err);
        })
});

/*router.post('/!*', function (req, res) {
    var datas = req.body;
    if (!datas) {
        return;
    }
    var astServer = globalVar.getAstServer(datas.astIds);
    if (!astServer) {
        res.status(500).send('error');
        return;
    }
    request.post(util.generatePostOption(globalVar.generateURL(astServer, '/gm/accountUpdate'), datas),
        function (e, r, httpBody) {
            if (e) {
                res.status(500).send(e);
                return;
            }

            if (r.statusCode !== 200) { // HTTP OK
                res.status(500).send('Bad status code ' + r.statusCode + '. body is ' + httpBody);
                return;
            }
            var body = JSON.parse(httpBody);
            if (body.code === undefined || body.code !== Code.OK) {
                res.status(500).send('failed, error : ' + JSON.stringify(body.error));
                return;
            }
            res.send(body.data);
        }
    );
});*/


module.exports = router;
