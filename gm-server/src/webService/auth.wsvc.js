/**
 * Created by Jin on 2016/6/10.
 */

app.webServiceModule
    .factory('authWebService', [
        'apiService',
        function (apiService) {
            return {
                login: function (model) {
                    return apiService.post('/api/users/login', model);
                },
                checkLogin: function (model) {
                    return apiService.get('/api/users/checkLogin', model);
                },
                signUp: function (model) {
                    return apiService.post('/api/users/signup', model);
                },
                logout: function (model) {
                    return apiService.get('/api/users/logout', model);
                }
            }
        }]);