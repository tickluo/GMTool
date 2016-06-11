/**
 * Created by zhongjie.zhang on 2016/3/21.
 */

var utility = module.exports;
/*var security = require('../../shared/security.js');*/

utility.generatePostOption = function(url, data){
    var options = {
        url: url,
       /* ca: security.tlsCa,
        key: security.tlsKey,
        cert: security.tlsCert,*/
        form: data
    };

    return options;
};

