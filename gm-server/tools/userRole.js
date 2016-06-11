/**
 * Created by zhongjie.zhang on 2016/2/15.
 */
var acl = require('acl');
var mongoose = require('mongoose');
var db = require('../lib/dbConn');

mongoose.connection.on('connected', function() {
    console.log('db...................on2');
    acl = new acl(new acl.mongodbBackend(mongoose.connection.db, 'acl'));
    acl.allow([
        {
            roles:['guest','member'],
            allows:[
                {resources:'blogs', permissions:'get'},
                {resources:['forums','news'], permissions:['get','put','delete']}
            ]
        },
        {
            roles:['gold','silver'],
            allows:[
                {resources:'cash', permissions:['sell','exchange']},
                {resources:['account','deposit'], permissions:['put','delete']}
            ]
        }
    ]);
});
