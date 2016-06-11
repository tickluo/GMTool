/**
 * Created by Jin on 2016/6/10.
 */

app.webServiceModule
    .factory('authWebService', [
        'apiService',
        function (apiService) {
            return {
                login: function (model) {
                    return apiService.postMock('/api/users/login', model);
                },
                checkLogin: function (model) {
                    return apiService.getMock('/api/users/checkLogin', model);
                },
                signUp: function (model) {
                    return apiService.postMock('/api/users/signup', model);
                },
                logout: function (model) {
                    return apiService.getMock('/api/users/logout', model);
                }
            }
        }]);