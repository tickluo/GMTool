/**
 * Created by Jin on 2016/6/10.
 */


app.webServiceModule
    .factory('initWebService', [
        'apiService',
        function (apiService) {
            return {
                getInitSetting: function (model) {
                    return apiService.getMock('/api/init/setting', model);
                },
                postAdminSetting: function (model) {
                    return apiService.postMock('/api/init/setup', model);
                }
            }
        }]);