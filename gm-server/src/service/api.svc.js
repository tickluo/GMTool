/**
 * Created by chuan.jin on 2016/6/2.
 */

app.serviceModule.factory('apiService', [
    '$http',
    '$q',
    '$cookies',
    'appConst',
    '$httpParamSerializer',
    function ($http, $q, $cookies, appConst, $httpParamSerializer) {
        //TODO:will corsReq need to new?
        var gmServerUrl = 'http://' + appConst.gmServerUrl;
        var mockServerUrl = 'http://localhost:3003';

        return {

            /*           get: function (url, params) {
             var corsReq = {
             method: 'GET',
             url: gmServerUrl + url,
             params: params,
             paramSerializer: '$httpParamSerializer'
             };
             return $http(corsReq);
             },

             post: function (url, data) {
             var corsReq = {
             method: 'POST',
             headers: {
             'Content-Type': 'application/x-www-form-urlencoded'
             },
             url: gmServerUrl + url,
             data: $httpParamSerializer(data)
             };
             return $http(corsReq);
             }*/

            get: function (url, params) {
                return $http.get(gmServerUrl + url, {
                    params: params,
                    headers: {
                        token: $cookies.get('token')
                    }
                })
            },

            post: function (url, data) {
                return $http.post(gmServerUrl + url, data, {
                    headers: {
                        token: $cookies.get('token')
                    }
                });
            },
            getMock: function (url, params) {
                return $http.get(mockServerUrl + url, {
                    params: params,
                    headers: {
                        token: $cookies.get('token')
                    }
                });
            },

            postMock: function (url, data) {
                return $http.post(mockServerUrl + url, data, {
                    headers: {
                        token: $cookies.get('token')
                    }
                });
            }
        }
    }])
;