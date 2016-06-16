/**
 * Created by Jin on 2016/5/30.
 */

app.appModule
    .controller('loginCtrl', [
        '$timeout',
        '$state',
        'authService',
        function ($timeout, $state, authService) {
            if(authService.isAuthenticated()){
                $state.go('layout.auth.user');
            }

            this.hideSignForm = true;
            this.hideLoginForm = false;
            this.hideTipForm = false;
            this.formTip = 'sign up';
            this.toggleForm = angular.bind(this, toggleForm);
            this.submitLogin = angular.bind(this, startLogin, $timeout, $state, authService);
            this.submitSignUp = angular.bind(this, signUp, authService, $state,$timeout);
        }]);


function startLogin($timeout, $state, authService) {
    var context = this;
    authService.login(context.user)
        .then(
            function (res) {
                if (res) {
                    context.startFade = true;
                    context.startLogin = true;
                    context.hideLoginForm = true;
                    context.hideTipForm = true;
                    $timeout(function () {
                        $state.go('layout.auth.user');
                    }, 2000);
                }
                else {

                }

            })
}

function signUp(authService, $state, $timeout) {
    var context = this;
    authService.signUp(context.signUp)
        .then(
            function (res) {
                context.hideTipForm = true;
                context.startLogin = true;
                context.startFade = true;
                context.hideSignForm = true;
                $timeout(function () {
                    $state.go('layout.auth.user');
                }, 2000);
            },
            function (err) {

            });
}

function toggleForm() {
    var context = this;
    context.formTip = context.hideLoginForm ? 'sign up' : 'back';
    context.hideLoginForm = !context.hideLoginForm;
    context.hideSignForm = !context.hideSignForm;
}



