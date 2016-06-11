/**
 * Created by Jin on 2016/6/10.
 */

app.webServiceModule
    .factory('settingWebService', [
        'apiService',
        function (apiService) {
            return {
                fetchAstSvrList: function (model) {
                    return apiService.get('/authApi/setting/astSvrList', model);
                }
            }
        }]);