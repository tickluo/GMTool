/*
 app.serviceModule.service('authService', [function () {
 this.a = 1
 }]);
 */

app.serviceModule
    .factory('authService', [
        '$http',
        '$q',
        '$cookies',
        'authWebService',
        'avatarConst',
        'stateConst',
        '$log',
        function ($http, $q, $cookies, authWebService, avatarConst, stateConst, $log) {
            var authorities = [],
                userInfo;

            return {
                login: function (user) {
                    return authWebService.login(user).then(function (res) { //res: {code,msg,data}
                        if (res.data.code === 401) {
                            /* userInfo = res.data;
                             userInfo.avatar = avatarConst[res.data.role];*/
                            /* authorities = res.data.authorities;*/
                            alert(res.data.msg);
                            return false;
                        }
                        var expires = new Date();
                        expires = expires.setHours(expires.getHours() + 2);
                        $cookies.put('token', res.data.data, {expires: new Date(expires)});
                        return true;
                    });
                },

                signUp: function (user) {
                    var context = this;
                    var deferred = $q.defer();
                    authWebService.signUp(user).then(function (res) {
                        if (res.data) {
                            var expires = new Date();
                            expires = expires.setHours(expires.getHours() + 2);
                            $cookies.put('token', res.data.data, {expires: new Date(expires)});
                            deferred.resolve();
                            /*context.login(res.data).then(function () {
                             deferred.resolve();
                             });*/
                        }
                        else deferred.reject();
                    }, function (res) {
                        //TODO:catch 401 from console
                        if (res.status === 401) {
                            deferred.reject(res.data);
                        } else {
                            deferred.reject(stateConst.AUTH_REJECT);
                        }
                    });
                    return deferred.promise;
                },

                logout: function () {
                    return authWebService.logout()
                        .then(function () {
                            return $cookies.remove('token')
                        })
                        .catch(function (err) {
                            if (err.status === 401) throw stateConst.AUTH_REJECT;
                            throw stateConst.SERVERS_ERROR;
                        });
                },

                checkLogin: function () {
                    return authWebService.checkLogin()
                        .then(function (res) {
                            userInfo = res.data;
                        })
                        .catch(function (err) {
                            if (err.status === 401) throw stateConst.AUTH_REJECT;
                            throw stateConst.SERVERS_ERROR;
                        });
                },

                getAuthorities: function () {
                    return authorities;
                },
                getUserInfo: function () {
                    $log.debug('-----getUserInfo-----');
                    return userInfo;
                }
            };
        }
    ]);
