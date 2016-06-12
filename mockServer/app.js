/**
 * Created by chuan.jin on 2016/6/2.
 */
var mockServer = require('node-mock-server');

/*    cors = require('cors'),
    express = require('express');

var app = express();

app.use(cors);*/

var options = {
    restPath: __dirname + '/rest',
    title: 'mock server',
    urlBase: 'http://localhost:3003',
    urlPath: '/authApi',
    funcPath: __dirname + '/api',
    port: 3003
};

mockServer(options);