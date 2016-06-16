var express = require('express'),
    auth = require('../lib/auth'),
    accountModel = require('../lib/models/account'),
    settingModel = require('../lib/models/setting'),
    mail = require('../lib/mail'),
    uuid = require('node-uuid'),
    sessionContaner = require('../middleware/container')(),
    moment = require('moment'),
    router = express.Router();

/*router.get('/login', function (req, res) {
 console.log('router:users:login:get');
 return res.sendFile(req.app.locals.dirName + '/MetroTheme/page_login.html');
 });*/

router.post('/signup', function (req, res) {
    var user = req.body;
    user.role = 'Observer';
    user.isblocked = false;
    accountModel.register(user, function (err, userInfo) {
        if (err) {
            res.status(401).send("sign up failed, try again.");
        }
        else {
            /*req.session.username = user.userName;
             res.send(savedUser);*/
            var token = uuid.v4();
            var adminEmail = {};
            settingModel.get('accSvrURL', function (err, admin) {
                //todo:deal err
                adminEmail = admin;
                userInfo.isAuthenticated = true;
                sessionContaner[token] = userInfo;
                sessionContaner[token].time = new Date();
                mail.sendOne({
                    fromEmail: adminEmail.email,
                    subject: user.name + ' 向您发了一封申请邮件',
                    toEmail: adminEmail.email,
                    admin: adminEmail.admin,
                    user: user.name,
                    sendDate: moment().format('YYYY-MM-DD HH:mm'),
                    redirectUrl: 'http://localhost:8000/#!/login'
                }, function (err, message, html, text) {
                    console.log(err);
                    if (err)  return res.sendStatus(403);
                    res.send({code: 200, data: {token: token, role: user.role, isblocked: user.isblocked}});
                });
            });
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
            userInfo.isAuthenticated = true;
            sessionContaner[token] = userInfo;
            sessionContaner[token].time = new Date();
            /*req.session[token] = user;*/
            res.send({code: 200, data: {token: token, role: userInfo.role, isblocked: userInfo.isblocked}});
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
