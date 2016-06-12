var express    = require('express');
var bodyParser = require('body-parser');
/*var partials   = require('express-partials');*/
var users      = require('./routes/users');
var account   = require('./routes/account');
var init      = require('./routes/init');
var gm        = require('./routes/gm');
var setting        = require('./routes/setting');
var ejs        = require('ejs');
var app        = express();
var globalVar = require('./lib/globalVariable');
var auth = require('./lib/auth');
/*var session = require('express-session');*/
var cors = require('cors');

app.locals.dirName = __dirname;
/*
// passport config
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
app.use(passport.initialize());
app.use(passport.session());
var Account = require('./models/user');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());
*/

app.set("view options",{ "layout":false});
app.set('views', __dirname + '/views');
app.set("view engine","html");
app.set('case sensitive routing', true);

//TODO:set cors options
app.use(cors());
/*app.use(partials());*/
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));
/*app.use('/users', express.static(__dirname + "/MetroTheme"));
app.use('/account', express.static(__dirname + "/MetroTheme"));
app.use('/gm', express.static(__dirname + "/MetroTheme"));
app.use('/init', express.static(__dirname + "/MetroTheme"));
app.use('/', express.static(__dirname + "/MetroTheme"));*/

/*app.use(session({
    secret: 'xxJIUsss81209KKiqpod!@##@!os',
    name: 'cookie:jttwdb-gm',
    proxy: true,
    resave: true,
    saveUninitialized: true
}));*/

globalVar.initialize();
auth.initialize();

require('./routes')(app);

/*app.use('/users/', users); //login
app.use('/init/', init);
app.use('/setting/', auth.authFunc, setting);
app.use('/user/', auth.authFunc, user);
app.use('/gm/', auth.authFunc, gm);*/

app.engine('.html', ejs.__express);
/*app.disable("x-powered-by");*/

app.listen(8089);

// Uncaught exception handler
process.on('uncaughtException', function (err) {
    console.error(' Caught exception: ' + err.stack);
});
