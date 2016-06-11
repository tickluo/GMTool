var crypto = require('crypto');
var token = module.exports;

/**
 * Create token by username. Encrypt uid and timestamp to get a token.
 * 
 * @param  {String}        userId
 * @param  {String}        openId 
 * @param  {String}        userName
 * @param  {String|Number} timestamp
 * @param  {String}        pwd           encrypt password
 * @return {String}                      token string
 */
token.create = function (uid, openId, userName, timestamp, pwd) {
    var msg = uid + '|' + openId + '|' + userName + '|' + timestamp;
    var cipher = crypto.createCipher('aes256', pwd);
    var enc = cipher.update(msg, 'utf8', 'hex');
    enc += cipher.final('hex');
    return enc;
};

/**
 * Parse token to validate it and get the uid and timestamp.
 * 
 * @param  {String} token token string
 * @param  {String} pwd   decrypt password
 * @return {Object} uid, userName and timestamp that exported from token. null for illegal token.     
 */
token.parse = function (token, pwd) {
    var decipher = crypto.createDecipher('aes256', pwd);
    var dec;
    try {
        dec = decipher.update(token, 'hex', 'utf8');
        dec += decipher.final('utf8');
    } catch (err) {
        console.error('Token::parse: failed to decrypt token. %j', token);
        return null;
    }
    var ts = dec.split('|');
    if (ts.length !== 4) {
        // illegal token
        return null;
    }
    return {
        uid: ts[0],
        openId: ts[1],
        userName: ts[2],
        timestamp: Number(ts[3])
    };
};

