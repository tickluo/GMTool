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
                    controller: [
                        '$scope',
                        'authorities',
                        '$state',
                        function ($scope, authorities, $state) {
                            $scope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParams) {
                                /*filter unAuth url*/
                                var states = authorities.map(function (item) {
                                    return 'layout.auth.' + item
                                });
                                if (states.indexOf(toState.name) < 0) {
                                    toState.name !== 'layout.auth.user' && $state.go('layout.auth.user');
                                }
                                $scope.transitionState = "active";
                            });
                        }],
                    templateUrl: 'app/layout.html',
                    resolve: {
                        authorities: ['authService', 'stateConst', function (authService, stateConst) {
                            return authService.getAuthorities();
                            /*return $q.reject(stateConst.AUTH_REJECT);*/
                        }]
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
                .state('layout.auth', {
                    url: '/auth',
                    templateUrl: 'app/auth/layout.html'
                })
                .state('layout.auth.user', {
                    url: '/user',
                    templateUrl: 'app/auth/user/user.html'
                })
                .state('layout.auth.gm', {
                    url: '/gm',
                    templateUrl: 'app/auth/gm/gm.html'
                })
                .state('layout.auth.account', {
                    url: '/account',
                    templateUrl: 'app/auth/account/account.html'
                })
                .state('layout.auth.setting', {
                    url: '/setting',
                    templateUrl: 'app/auth/view2/view2.html'
                });

            $urlRouterProvider.otherwise('/auth/user')
        }
    ])

    .run([
        '$rootScope',
        'stateConst',
        'appConst',
        '$state',
        '$log',
        'initService',
        'authService',
        function ($rootScope, stateConst, appConst, $state, $log, initService, authService) {
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
                var isAuthenticated = authService.isAuthenticated();
                if ((isAuthenticated && !$state.is(toState.name)) || toState.name === 'login') {
                    return;
                }

                event.preventDefault();
                authService
                    .checkLogin()
                    .then(function (user) {

                        var isAuthenticated = user.isAuthenticated === true;

                        if (isAuthenticated) {
                            // let's continue, use is allowed
                            $state.go(toState, toParams);
                            return;
                        }
                        // log on / sign in...
                        $state.go("login");
                    }).catch(function () {
                    $state.go("login");
                })
            })
        }]);

document.addEventListener('DOMContentLoaded', function () {
    angular.bootstrap(document, [
        'myApp'
    ]);
});
