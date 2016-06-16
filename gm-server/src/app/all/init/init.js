/**
 * Created by chuan.jin on 2016/6/6.
 */
app.appModule.controller('initCtrl', [
    'initService',
    '$state',
    function (initService, $state) {
        initService.getInitSetting()
            .then(function (res) {
                if (res) {
                    $state.go('login');
                }
            })
            .catch(function () {
                    $state.go('login');
            });

        this.curStep = 1;
        this.adminSet = angular.bind(this, adminSet, initService);
        this.emailSet = angular.bind(this, emailSet, initService);
        this.serverSet = angular.bind(this, serverSet, initService, $state);
    }]);

function adminSet(initService) {
    var context = this;
    context.curStep = 2;
    var adminInfo = {
        admin: context.admin.account,
        email: context.admin.email,
        password: context.admin.password
    };
    initService.saveAdmin(adminInfo);
}

function emailSet(initService) {
    var context = this;
    context.curStep = 3;
    var emailInfo = {
        SMTPHost: context.admin.SMTPHost,
        SMTPPort: context.admin.SMTPPort,
        emailPwd: context.admin.emailPwd
    };
    initService.saveEmail(emailInfo);
}

function serverSet(initService, $state) {
    var context = this;
    var postInfo = jsonConcat(jsonConcat(initService.getAdmin(), initService.getEmail()), {
        host: context.admin.host,
        port: context.admin.port
    });

    initService.postAdminSetting(postInfo).then(
        function (res) {
            $state.go('login');
        }, function (err) {
            context.message = err;
        }
    ).catch(function (err) {
        context.message = err;
    });
}


function jsonConcat(o1, o2) {
    for (var key in o2) {
        o1[key] = o2[key];
    }
    return o1;
}



