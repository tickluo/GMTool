'use strict';

app.appModule.controller('View2Ctrl', [
    '$scope',
    '$log',
    function (view2, $log) {
        view2.name = 'view2';
        $log.debug('OK');
    }
]);