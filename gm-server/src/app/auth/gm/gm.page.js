'use strict';

app.appModule
    .controller('gmCtrl', [
        'authService',
        function (authService) {
            var context = this;
            context.attenchments = [];
            context.addAttachment = function () {
                context.attenchments.push('test')
            };
        }]);
