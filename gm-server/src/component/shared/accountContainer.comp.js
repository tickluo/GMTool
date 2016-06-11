app.componentModule
    .component('account', {
        templateUrl: 'component/shared/accountContainer.tpl.html',
        controller: [
            'authService',
            '$state',
            function (authService,$state) {
            var context = this;
            context.user = authService.getUserInfo();
            context.logOut = function(){
                authService.logout().then(function(){
                    $state.go('login');
                });
            }
        }],
        controllerAs: 'ctrl'
    });