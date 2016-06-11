'use strict';

app.appModule
    .config([
        '$locationProvider',
        '$httpProvider',
        '$stateProvider',
        '$urlRouterProvider',
        '$logProvider',
        '$mdThemingProvider',
        'appConst',
        function ($locationProvider, $httpProvider, $stateProvider, $urlRouterProvider, $logProvider, $mdThemingProvider, appConst) {
            $logProvider.debugEnabled(appConst.debug);
            $locationProvider.hashPrefix('!');

            $mdThemingProvider.theme('default').primaryPalette('grey', {
                'default': '500',
                'hue-1': '200',
                'hue-2': '600',
                'hue-3': '800'
            });

            $stateProvider
                .state('login', {
                    url: '/login',
                    templateUrl: 'app/all/login/login.html'
                })
                .state('init', {
                    url: '/init',
                    templateUrl: 'app/all/init/init.html'
                })
                .state('layout', {
                    //TODO: set static layout to the route
                    /*controller: 'layoutCtrl',
                     controllerAs: 'ctrl',*/
                    controller: ['$scope', function ($scope) {
                        $scope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParams) {
                            $scope.transitionState = "active";
                        });
                    }],
                    templateUrl: 'app/layout.html',
                    resolve: {
                        'auth': function (authService, $log) {
                            return authService.getAuthorities();
                        }
                    }
                });

            $stateProvider
                .state('error', {
                    url: '/error',
                    templateUrl: 'app/error/layout.html'
                })
                .state('error.serverError', {
                    url: '/serverError?redirect_state_name',
                    templateUrl: 'app/error/serverError.page.html'
                });

            $stateProvider
                .state('layout.all', {
                    url: '/all',
                    /*controller: 'globalCtrl',*/
                    template: '<ui-view/>'
                })
                .state('layout.all.login', {
                    url: '/view1',
                    controller: 'showCtrl',
                    /*controllerAs: 'ctrl',*/
                    templateUrl: 'app/auth/view1/view1.html'
                });

            $stateProvider
                .state('layout.auth', {
                    url: '/auth',
                    templateUrl: 'app/auth/layout.html',
                    resolve: {
                        authorities: ['authService', 'stateConst', function (authService, stateConst) {
                            return authService.checkLogin();
                            /*return $q.reject(stateConst.AUTH_REJECT);*/
                        }]
                    }
                })
                .state('layout.auth.user', {
                    url: '/user',
                    templateUrl: 'app/auth/user/user.html'
                })
                .state('layout.auth.view1', {
                    url: '/view1',
                    templateUrl: 'app/auth/view1/view1.html'
                })
                .state('layout.auth.view2', {
                    url: '/view2',
                    templateUrl: 'app/auth/view2/view2.html'
                });

            $urlRouterProvider.otherwise('/auth/view1')
        }
    ])

    .run([
        '$rootScope',
        'stateConst',
        'appConst',
        '$state',
        '$log',
        'initService',
        function ($rootScope, stateConst, appConst, $state, $log, initService) {
            $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
                $log.debug(error);
                switch (error) {
                    case stateConst.AUTH_REJECT :
                        $state.go('login', {
                            redirect_state_name: fromState.name
                        });
                        break;
                    case stateConst.SERVERS_ERROR :
                        $state.go('error.serverError', {
                            redirect_state_name: fromState.name
                        });
                        break;
                    default :
                        $state.go('error.serverError', {
                            redirect_state_name: fromState.name
                        });
                        break;
                }
            });
            $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams, error) {
                initService.getInitSetting().then(function (res) {
                    if (toState.name !== 'init') {
                        event.preventDefault();
                        $state.go('init');
                    }
                })
            })
        }]);

document.addEventListener('DOMContentLoaded', function () {
    angular.bootstrap(document, [
        'myApp'
    ]);
});
