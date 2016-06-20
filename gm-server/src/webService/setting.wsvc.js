/**
 * Created by Jin on 2016/6/10.
 */

app.webServiceModule
    .factory('settingWebService', [
        'apiService',
        function (apiService) {
            return {
                fetchAstSvrList: function (model) {
                    return apiService.getMock('/authApi/setting/astSvrList', model);
                },
                getAdminSetting: function (model) {
                    return apiService.get('/authApi/setting/getConfig', model);
                },
                updateAdminSetting: function (model) {
                    return apiService.post('/authApi/setting/updateConfig', model);
                }
            }
        }]);