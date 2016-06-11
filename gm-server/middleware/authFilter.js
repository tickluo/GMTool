/**
 * Created by chuan.jin on 2016/6/7.
 */
var sessionContainer = require('./container')();

/*{token:'',user:{...},time:+new Date()}*/
module.exports = function (req, res, next) {
    var token =  req.get('token');
    var session = sessionContainer[token];
    if (token && session){
        var dateSpan = new Date() - session.time;
        if(dateSpan <= 7200000 && dateSpan >= 0){
            return next();
        }
    }
    res.status(401).send({});
};