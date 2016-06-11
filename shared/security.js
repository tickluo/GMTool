var fs = require('fs');
var path = require('path');

var officialCa = fs.readFileSync(path.join(__dirname, './tls/official-cert.pem'));
var officialKey = fs.readFileSync(path.join(__dirname, './tls/official-key.pem'));
var tlsCa = fs.readFileSync(path.join(__dirname, './tls/ca-cert.pem'));
var tlsKey = fs.readFileSync(path.join(__dirname, './tls/server-key.pem'));
var tlsCert = fs.readFileSync(path.join(__dirname, './tls/server-cert.pem'));
var dhparam = fs.readFileSync(path.join(__dirname, './tls/dhparam.pem'));

module.exports = {
    officialCa: officialCa,
    officialKey: officialKey,
    tlsCa: tlsCa,
    tlsKey: tlsKey,
    tlsCert: tlsCert,
    dhparam: dhparam
};
