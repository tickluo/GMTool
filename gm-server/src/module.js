var app = {};
app.directiveModule = angular.module('myApp.directive', ['myApp.service']);
app.componentModule = angular.module('myApp.component', ['myApp.service']);
app.webServiceModule = angular.module('myApp.webService', ['myApp.service']);
app.serviceModule = angular.module('myApp.service', []);
app.constModule = angular.module('myApp.const', []);

app.appModule = angular.module('myApp', [
    'myApp.service',
    'myApp.webService',
    'myApp.directive',
    'myApp.component',
    'ui.router',
    'myApp.version',
    'myApp.const',
    'ngMaterial',
    'ngCookies',
    /*    'ngMessages',*/
    'ngAnimate',
    'ui.grid',
    'ui.grid.pagination'
]);

