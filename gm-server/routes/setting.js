var express = require('express');
var router = express.Router();
var setting = require('../lib/models/setting');
var gv = require('../lib/globalVariable');
var request = require('request');
var util = require('../lib/utility');
var Code = require("../../shared/code");

router.get('/', function (req, res) {
    setting.getAll(function (err, doc) {
        if (err) {
            res.status(500).send(err);
        }
        else {
            var info = {};
            info.setting = doc;
            info.hotConfig = {};
            // get hot config
            request.get(util.generatePostOption(gv.accountServerURL + '/gm/get/hotConfig'),
                function (e, r, httpBody) {
                    if (!!httpBody) {
                        var body = JSON.parse(httpBody);
                        for (var i in body) {
                            info.hotConfig[i] = body[i];
                        }
                    }
                    res.send(info);
                });
        }
    });
});

router.get('/getConfig', function (req, res) {
    setting.get('accSvrURL', function (err, doc) {
        if (err) {
            return res.status(500).send(err)
        }
        return res.status(200).send(doc)
    })
});

router.get('/astSvrList', function (req, res) {
    res.send(gv.astServerURLMap);
});


router.post('/updateConfig', function (req, res) {
    var config = req.body;
    setting.save('accSvrURL', config, function (err, doc) {
        if (err) {
            res.status(500).send(err);
        }
        else {
            gv.initialize();
            res.status(200).send(doc);
        }
    });
});

router.post('/update', function (req, res) {
    var d = req.body;
    if (!d || !d.k || !d.v) {
        res.status(500).send('error, please input valid value.');
        return;
    }

    setting.save(d.k, d.v, function (err, doc) {
        if (err) {
            res.status(500).send(err);
        }
        else {
            res.send(doc);
            if (d.k === gv.accSvrURLKey) {
                gv.initialize();
            }
        }
    });
});

router.post('/updateHotConfig', function (req, res) {
    var d = req.body;
    if (!d || !d.k) {
        res.status(500).send('error');
        return;
    }
    if (d.k === 'appleReview') {
        request.post(util.generatePostOption(gv.accountServerURL + '/gm/update/appleReview', {'ver': d.v}),
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
                res.send('done');
            }
        );
    }
    else if (d.k === 'hotUpdate') {
        request.post(util.generatePostOption(gv.accountServerURL + '/gm/update/version/info', {k: d.v1, v: d.v2}),
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
                res.send('done');
            }
        );
    }
    else {
        res.status(500).send('error:not support type');
        return;
    }
});


module.exports = router;
