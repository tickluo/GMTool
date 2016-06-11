/**
 * Created by chuan.jin on 2016/6/8.
 */
app.componentModule
    .component('astSvr', {
        templateUrl: 'component/shared/astSvrList.tpl.html',
        controller: [
            'settingWebService',
            function (settingWebService) {
                var context = this;
                settingWebService.fetchAstSvrList()
                    .then(
                        function (res) {
                            context.serverList = res.data
                        },
                        function (err) {

                        });
            }],
        controllerAs: 'ctrl'
    });