/**
 * Created by chuan.jin on 2016/6/2.
 */
module.exports = {

    user: function (userName, role) {

        userName = userName || '';
        role = role || '';

        return JSON.stringify({
            userName: userName,
            role: role
        });
    }

};