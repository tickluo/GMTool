'use strict';

app.appModule

    .controller('View1Ctrl', [
        'authService',
        function (authService) {
            this.name = authService.a;
        }]);