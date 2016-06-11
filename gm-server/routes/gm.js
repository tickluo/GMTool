var express = require('express');
var router = express.Router();
var request = require('request');
var util =  require('../lib/utility');
var gv =  require('../lib/globalVariable');
var async = require('async');

/*router.get('/', function(req, res) {
    res.render('gm', router.emptyData());
});*/

router.get('/kick/:type/:val', function(req, res) {
    var type = (req.params.type);
    var val = (req.params.val);
    var cond = {};
    switch (type){
        case 'uid':
            cond = {uid:val};
            break;
        case 'openId':
            cond = {openId:val};
            break;
        case 'username':
            cond = {userName:val};
            break;
        case 'nickname':
            cond = {'data.nickName':val};
            break;
        default :
            res.send("not support type");
            return;
    }

    request.post(util.generatePostOption(astSvrUrl + '/kickUser', cond),
        function (err/*, httpReponse, body*/) {
            if (!!err) {
                res.status(500).send("error");
            }  else{
                res.send("done");
            }
        });
});

router.get('/notify/:val', function(req, res) {
    var val = (req.params.val);
    request.post(util.generatePostOption(astSvrUrl + '/pushNotify', val),
        function (err/*, httpReponse, body*/) {
            if (!!err) {
                res.status(500).send("error");
            }  else{
                res.send("done");
            }
        });
});

router.post('/*', function (req, res) {
    var datas = req.body;
    if (!datas) {
        return;
    }
    var astServers = [];
    var ids = datas.astIds.split(',');

    for(var i = 0; i < ids.length; ++i){
        if(!!ids[i]){
            astServers.push(gv.getAstServer(ids[i]));
        }
    }

    var type = datas.type;
    var count1 = 0;
    var broadcast = function(){
        async.whilst(function() {
                return count1 < astServers.length;
            },
            function(cb) {
                request.post(util.generatePostOption(astServers[count1] + '/gm/broadcast/scrollingMsg', {msgInfo:{msg:datas.msg}}),
                    function (err) {
                        ++count1;
                        cb(err);
                    });
            },
            function(err) {
                if(err){
                    res.status(500).send(err);
                }
                else{
                    res.send("done");
                }
            });
    };

    var announce = function(){
        request.post(util.generatePostOption(gv.accountServerURL + '/gm/update/news', {title:datas.title, content:datas.val}),
            function (err) {
                if(err){
                    res.status(500).send(err);
                }
                else{
                    res.send("done");
                }
            });
    };

    var version = function(){
        request.post(util.generatePostOption(gv.accountServerURL + '/gm/update/version/info', {title:datas.title, content:datas.val}),
            function (err) {
                if(err){
                    res.status(500).send(err);
                }
                else{
                    res.send("done");
                }
            });
    };

    var mail = function(){
        var title = datas.title;
        var content = datas.content;
        var attachment = datas.attachment;
        var palyerCond = datas.palyerCond;
        var playerOpenIds = datas.playerOpenIds;
        var send = datas.send;
        if(!title || !content){
            res.status(500).send('mail content incorrect.');
            return;
        }

        // save
        res.send("done");
    };

    switch (type){
        case 'broadcast':
            broadcast();
            break;
        case 'announce':
            announce();
            break;
        case 'mail':
            mail();
            break;
        default :break;
    }

});

router.get('/announce/:title/:content', function(req, res) {

});

module.exports = router;
