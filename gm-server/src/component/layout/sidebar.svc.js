/**
 * Created by chuan.jin on 2016/6/1.
 */

app.serviceModule.factory('sidebarService', [
    '$http',
    '$q',
    function ($http, $q) {
        var menus = [
            {name:'GM',icon:''}
            ];

        return $q.when(menus)
    }]);