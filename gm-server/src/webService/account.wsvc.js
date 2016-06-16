/**
 * Created by chuan.jin on 2016/6/14.
 */

app.webServiceModule
    .factory('accountWebService', [
        'apiService',
        function (apiService) {
            return {
                getAccounts: function (model) {
                    return apiService.get('/authApi/account/getAccounts', model);
                },
                authAccount: function (model) {
                    return apiService.post('/authApi/account/authAccount', model);
                },
                blockAccount: function (model) {
                    return apiService.post('/authApi/account/blockAccount', model);
                }
            }
        }]);