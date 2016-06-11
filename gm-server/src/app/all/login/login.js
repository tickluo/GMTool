/**
 * Created by Jin on 2016/5/30.
 */

app.appModule
    .controller('loginCtrl', [
        '$timeout',
        '$state',
        'authService',
        function ($timeout, $state, authService) {
            this.hideSignForm = true;
            this.hideLoginForm = false;
            this.formTip = 'sign up';
            this.toggleForm = angular.bind(this, toggleForm);
            this.submitLogin = angular.bind(this, startLogin, $timeout, $state, authService);
            this.submitSignUp = angular.bind(this, signUp, authService, $state);
        }]);


function startLogin($timeout, $state, authService) {
    var context = this;
    authService.login(context.user)
        .then(
            function (res) {
                if (res) {
                    context.startFade = true;
                    context.startLogin = true;

                    $timeout(function () {
                        context.hideLoginForm = true;
                        $state.go('layout.auth.view1');
                    }, 2000);
                }
                else {
                    
                }

            })
}

function signUp(authService, $state) {
    var context = this;
    authService.signUp(context.signUp)
        .then(
            function (res) {
                $state.go('layout.auth.view1');
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



