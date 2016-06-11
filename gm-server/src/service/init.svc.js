/**
 * Created by chuan.jin on 2016/6/6.
 */
app.serviceModule.factory('initService', [
    '$q',
    'initWebService',
    '$log',
    function ($q, initWebService, $log) {
        var adminInit;
        var adminInfo = {};
        var emailInfo = {};


        function saveAdmin(admin) {
            adminInfo = admin;
        }

        function saveEmail(email) {
            emailInfo = email;
        }

        /* function postAdminSetting(postInfo) {
         var deferred = $q.defer();
         apiService.postAdminSetting(postInfo).then(function (res) {
         debugger;
         if (res.done) deferred.resolve();
         else deferred.reject();
         });
         return deferred.promise;
         }*/

        return {

            saveAdmin: saveAdmin,
            saveEmail: saveEmail,

            getAdmin: function () {
                return adminInfo;
            },

            getEmail: function () {
                return emailInfo;
            },

            getInitSetting: function () {
                var deferred = $q.defer();
                initWebService.getInitSetting({}).then(function (res) {
                    if (!res.data)  deferred.resolve();
                    else deferred.reject();
                });
                return deferred.promise;
            },

            postAdminSetting: function (adminInfo) {
                var deferred = $q.defer();
                initWebService.postAdminSetting(adminInfo)
                    .then(function (res) {
                        res.data.success ? deferred.resolve(res.data) : deferred.reject(res.data.msg);
                    })
                    .catch(function (err) {
                        deferred.reject(err);
                    });
                return deferred.promise;
            }
        }
    }]);