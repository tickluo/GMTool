var express = require('express');
var auth = require('../lib/auth');
var accountModel = require('../lib/models/account');
var uuid = require('node-uuid');
var sessionContaner = require('../middleware/container')();
var router = express.Router();

router.get('/login', function (req, res) {
    console.log('router:users:login:get');
    return res.sendFile(req.app.locals.dirName + '/MetroTheme/page_login.html');
});

router.post('/signup', function (req, res) {
    var user = req.body;
    user.role = 'Observer';
    accountModel.register(user, function (err, userInfo) {
        if (err) {
            res.status(401).send("sign up failed, try again.");
        }
        else {
            /*req.session.username = user.userName;
             res.send(savedUser);*/
            var token = uuid.v4();
            sessionContaner[token] = userInfo;
            res.send({code: 200, data: token});
        }
    })
});

router.post('/login', function (req, res) {
    var user = req.body;
    auth.checkAuth(req, user.userName, user.password, function (err, userInfo) {
        if (err) {
            res.send({code: 401, msg: err});
        }
        else {
            var token = uuid.v4();
            sessionContaner[token] = userInfo;
            /*req.session[token] = user;*/
            res.send({code: 200, data: token});
        }
    });
});

router.get('/checkLogin', function (req, res) {
    if (sessionContaner[req.headers.token]) {
        return res.send(sessionContaner[req.headers.token]);
    }
    else {
        return res.status(401).send({});
    }
});

router.get('/logout', function (req, res) {
    console.log('logout');
    /*req.session.destroy(function (err) {
     if (err) {
     res.send("error");
     } else {
     res.redirect('/users/login');
     }
     });*/
    sessionContaner[req.headers.token] && delete sessionContaner[req.headers.token];
    return res.status(200).send({})
});


module.exports = router;
