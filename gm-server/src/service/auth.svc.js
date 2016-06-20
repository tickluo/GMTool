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
            var authorities,
                userInfo = undefined;

            function genAuthByRole(blocked, role) {
                authorities = [];
                role === 'Observer' || authorities.push('gm');
                role === 'Admin' && authorities.push('account') && authorities.push('setting');
            }

            return {
                login: function (user) {
                    return authWebService.login(user).then(function (res) { //res: {code,msg,data}

                        /*set token*/
                        var expires = new Date();
                        expires = expires.setHours(expires.getHours() + 2);
                        $cookies.put('token', res.data.data.token, {expires: new Date(expires)});

                        return true;
                    });
                },

                signUp: function (user) {
                    var context = this;
                    var deferred = $q.defer();
                    authWebService.signUp(user).then(function (res) {
                        if (res.data) {

                            /*set token*/
                            var expires = new Date();
                            expires = expires.setHours(expires.getHours() + 2);
                            $cookies.put('token', res.data.data.token, {expires: new Date(expires)});
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
                            $log.debug('-----logout-----');
                            authorities = [];
                            userInfo = undefined;
                            return $cookies.remove('token')
                        })
                        .catch(function (err) {
                            if (err.status === 401) throw stateConst.AUTH_REJECT;
                            throw stateConst.SERVERS_ERROR;
                        });
                },

                checkLogin: function () {
                    var deferred = $q.defer();

                    if (userInfo) {
                        return $q.when(userInfo);
                    }

                    $log.debug('-----checkLogin-----');
                    authWebService.checkLogin()
                        .then(function (res) {
                            userInfo = res.data;
                            userInfo.avatar = avatarConst[res.data.role];
                            /*set authorities*/
                            $log.debug('-----setAuthorities-----');
                            genAuthByRole(userInfo.blocked, userInfo.role);
                            deferred.resolve(userInfo);
                        })
                        .catch(function (err) {
                            if (err.status === 401)  deferred.reject(stateConst.AUTH_REJECT);
                            else throw deferred.reject(stateConst.SERVERS_ERROR);
                        });
                    return deferred.promise;
                },

                isAuthenticated: function () {
                    return userInfo !== undefined
                        && userInfo.isAuthenticated;
                },

                getAuthorities: function () {
                    $log.debug('-----getAuthorities-----');
                    return authorities;
                },
                getUserInfo: function () {
                    $log.debug('-----getUserInfo-----');
                    return userInfo;
                }
            };
        }
    ]);

