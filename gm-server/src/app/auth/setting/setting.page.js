'use strict';

app.appModule.controller('settingCtrl', [
    '$log',
    'settingWebService',
    '$mdDialog',
    function ($log, settingWebService, $mdDialog) {
        var context = this;
        /*var admin = authService.getUserInfo().userName;*/
        settingWebService.getAdminSetting()
            .then(function (res) {
                context.setting = res.data;
            })
            .catch(function (err) {

            });
        context.updateSetting = function () {
            settingWebService.updateAdminSetting(context.setting)
                .then(function (res) {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title('注意')
                            .textContent('您的设置已经更新')
                            .ariaLabel('Alert')
                            .ok('确定')
                    );
                })
                .catch(function (err) {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title('注意')
                            .textContent(err)
                            .ariaLabel('Alert')
                            .ok('确定')
                    );
                });
        }
    }
]);