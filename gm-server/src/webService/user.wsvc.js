/**
 * Created by chuan.jin on 2016/6/17.
 */

app.webServiceModule
    .factory('userWebService', [
        'apiService',
        function (apiService) {
            return {
                getPlayer: function (model) {
                    return apiService.post('/authApi/player/search', model);
                }
               /* authAccount: function (model) {
                    return apiService.post('/authApi/account/authAccount', model);
                },
                blockAccount: function (model) {
                    return apiService.post('/authApi/account/blockAccount', model);
                }*/
            }
        }]);