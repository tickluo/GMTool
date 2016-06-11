var cfg = require('../config/mongodb.json');
var DBConn = require('./dbConn');
var dbCfg = (process.env.NODE_ENV === 'production' ?
    cfg.production : cfg.development);

var DBConnFactory = function () {
    this.defaultAccDBConn = null;
    this.defaultJttwDBconn = null;
};

var pro = DBConnFactory.prototype;


/**
 * Get the default db connection to accountdb.
 *
 * @return {Object}   The DBConn object.
 */
pro.getDefaultAccDBConn = function () {
    if (!this.defaultAccDBConn) {
        this.defaultAccDBConn = new DBConn();
        this.defaultAccDBConn.start(dbCfg.accountdbUrl);
    }

    return this.defaultAccDBConn;
};

/**
 * Get the default db connection to jttwdb.
 *
 * @return {Object}   The DBConn object.
 */
pro.getDefaultJttwDBConn = function () {
    if (!this.defaultJttwDBConn) {
        this.defaultJttwDBConn = new DBConn();
        this.defaultJttwDBConn.start(dbCfg.jttwdbUrl);
    }

    return this.defaultJttwDBConn;
};

/**
 * Get one conn.
 *
 * @param  {String}   dbUrlStr    The database url.
 * @return {Object}               The DBConn object.
 */
pro.getConn = function (dbUrlStr) {
    var dbConn = new DBConn();
    dbConn.start(dbUrlStr);
    return dbConn;
};

var factory = new DBConnFactory();
module.exports = factory;
