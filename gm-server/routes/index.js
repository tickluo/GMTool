var users = require('./users'),
    account = require('./account'),
    gm = require('./gm'),
    init = require('./init'),
    setting = require('./setting'),
    player = require('./player'),
    auth = require('../middleware/authFilter');

module.exports = function (app) {
    app.use('/api/users', users);
    app.use('/api/init', init);
    app.use('/authApi', auth);
    app.use('/authApi/account', account);
    app.use('/authApi/player', player);
    app.use('/authApi/setting', setting);
    app.use('/authApi/gm', gm);
};
