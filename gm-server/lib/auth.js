/**
 * Created by zhongjie.zhang on 2016/3/18.
 */
var account = require('../lib/models/account');
var globalVar = require('../lib/globalVariable');

var auth = module.exports;

auth.authFunc = function(req, res, next){
    // initialized
    if(globalVar.isAccountServerSet()){
        // you can do this however you want with whatever variables you set up
        if (auth.can(req)){
            return next();
        }
        var sURL = req.app.locals.dirName + '/MetroTheme/page_login.html';
        return res.sendFile(sURL);
    }
// uninitialized
    else{
        if(!!req.body && !!req.body.username){
            next();
        }
        else{
            return res.sendFile(req.app.locals.dirName + '/MetroTheme/page_init.html');
        }
    }
};

auth.initialize = function(){
};

auth.can = function(req){
    if(!!req.session && !!req.session.username){
        return true;
    }
    return false;
};

auth.checkAuth = function(req, username, psw, cb){
    account.login(username, psw, cb);
};

