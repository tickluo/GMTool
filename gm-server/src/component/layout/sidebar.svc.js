/**
 * Created by chuan.jin on 2016/6/1.
 */

app.serviceModule.factory('sidebarService', [
    '$http',
    'authService',
    '$q',
    function ($http, authService, $q) {

        return {
            getAuthMenu: function () {
                var originalMenu = [
                    /*{name: 'GM', icon: '', sref: 'root.layout.auth.gm'}*/
                ];
                var authorities = authService.getAuthorities();
                authorities.forEach(function (item) {
                    originalMenu.push({name: item, sref: 'layout.auth.' + item});
                });
                return originalMenu
            }
        }
    }]);