var myAppModule = angular.module('myApp',  ["xeditable"]);

myAppModule.run(function(editableOptions) {
    editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
});

var getAstSvrIds = function(){
    return $("input:checkbox[name='astIPs']:checked").map(function() {
        return this.value;
    }).get();
};

var generatePostInfo = function(uid, path, type, info){
    info.type = type;
    if(uid){
        info.uid = uid;
    }
    info.astIds = getAstSvrIds();
    return {
        method: 'POST',
        url: (path + '/' + type).toString(),
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        transformRequest: function(obj) {
            var s = [];
            for(var p in obj){
                s.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            }
            return s.join("&");
        },
        data: info
    };
};

myAppModule.controller('SettingController', function($scope, $http) {
    $scope.messages = [];
    $scope.setting = {};
    $scope.channel = '';
    $scope.channelInfo = '';
    $http.get('/setting/').success(function(data){

        $scope.setting = data.setting;
        $scope.hotConfig = data.hotConfig;

    }).error(

        function(err){
            $scope.messages.push(err);
     });

    $scope.getSetting = function(k){
          for(var i in $scope.setting){
            if($scope.setting[i].k === k){
                return $scope.setting[i].v;
            }
          }
        return 'undefined';
    };

    $scope.getHotConfig = function(k){
        for(var i in $scope.hotConfig){
            if(i === k){
                return $scope.hotConfig[i];
            }
        }
        return '';
    };

    $scope.updateAccountServer = function()  {
        var info = generatePostInfo('', '/setting', 'update', {k:'accSvrURL',v: $("#accSvrURL").val()});
        $http(info).success(function(data){
            $scope.messages.push('done');
            for(var i in $scope.setting){
                if($scope.setting[i].k === data.k){
                    $scope.setting[i].v = data.v;
                    break;
                }
            }
        }).error(
            function(err){
                $scope.messages.push(err);
            });
    };

    $scope.updateAppleReview = function()  {
        var info = generatePostInfo('', '/setting', 'updateHotConfig', {k:'appleReview',v: $("#appleReview").val()});
        $http(info).success(function(data){
            $scope.messages.push('done');
            $scope.hotConfig[data.k] = data.v;
        }).error(
            function(err){
                $scope.messages.push(err);
            });
    };

    $scope.changeChannel = function(){
        $scope.channelInfo = {};

        if(!!$scope.hotConfig.versionInfo){
            $scope.channelInfo = $scope.hotConfig.versionInfo[ $scope.channel];
        }
    };

    $scope.updateHotUpdate = function()  {
        var str = $("#input_hotUpdate").val().replace(/[\r\n\t]/g, '');
        var info = generatePostInfo('', '/setting', 'updateHotConfig', {k:'hotUpdate',v1: $scope.channel, v2: str});
        $http(info).success(function(data){
            $scope.messages.push('done');
            $scope.channelInfo = str;
            $("#input_hotUpdate").val('');

        }).error(
            function(err){
                $scope.messages.push(err);
            });
    };
});

myAppModule.controller('AstSvrController', function($scope, $http) {
    $scope.lists = [];
    $scope.message = '';
    var init = function()  {
        debugger;
        $http.get('/setting/astSvrList').success(function(data, status, headers, config){
            $scope.lists = data;
        }).error(
            function(err){
                $scope.message = err;
            });
    };
    init();
});

myAppModule.controller('LoginController', function($scope, $http) {
    $scope.message = "";
    $scope.login = function()  {
        var info = generatePostInfo('', '/users', 'login', {username: $("#username").val(),password:$("#password").val()});
        $http(info).success(function(data, status, headers, config){
            $scope.disableSetup = false;
            $scope.message = 'Creating... done';
            window.location.href = data;
        }).error(
            function(err){
                $scope.message = err;
            });
    };
});

myAppModule.controller('GMController', function($scope, $http) {
    $scope.messages = [];
    $scope.gm_kick = function()  {
        var type =  $('input[name="input_searchType"]:checked').val();
        var val =  $("#input_searchVal").val();

        $http.get('/gm/kick/'+ type + '/' + val).success(function(data, status, headers, config){
            $scope.messages.push('done');
        }).error(
            function(err){
                $scope.messages.push(err);
            });
    };

    $scope.gm_notify = function()  {
        var val =  $("#input_notify").val();
        $http.get('/gm/notify/'+ val).success(function(data, status, headers, config){
            $scope.messages.push('done');
        }).error(
            function(err){
                $scope.messages.push(err);
            });
    };

    $scope.gm_broadcast = function()  {
        var val =  $("#input_broadcast").val();
        $http(generatePostInfo('', '/gm', 'broadcast', {msg:val})).success(function(data, status, headers, config){
            $scope.messages.push('done');
        }).error(
            function(err){
                $scope.messages.push(err);
        });
    };


    $scope.gm_announce = function()  {
        var title =  $("#input_announce_title").val();
        var val =  $("#input_announce").val();
        $http(generatePostInfo('', '/gm', 'announce', {title:title,val:val})).success(function(data, status, headers, config){
            $scope.messages.push('done');
        }).error(
            function(err){
                $scope.messages.push(err);
            });
    };

    $scope.mail_attachments = [];
    $scope.mail_playerConds = [];
    $scope.gm_mail_add_player = function(){
        var type = $("#playerCondType").val();
        var cond = $("#playerCond").val();
        var val = $("#playerCondVal").val();
        var key = type + '-' + cond + '-' + val;
        $scope.mail_playerConds.push({type:type,cond:cond,val:val,key:key});
    };

    $scope.gm_mail_remove_player = function(key){
        for(var i = 0; i < $scope.mail_playerConds.length; ++i){
           if(key ===  $scope.mail_playerConds[i].key){
               $scope.mail_playerConds.splice(i, 1);
               break;
           }
        }
    };

    $scope.gm_mail_add_attach = function(){
        var type = $("#mailAttType").val();
        var typeName = $("#mailAttType option:selected").text();
        var theId = $("#mailAttId").val();
        var count = $("#mailAttCount").val();
        var key = type + '-' + theId + '-' + count;
        $scope.mail_attachments.push({type:type,id:theId,count:count,key:key,typeName:typeName});
    };

    $scope.gm_mail_remove_attachment = function(key){
        for(var i = 0; i < $scope.mail_attachments.length; ++i){
            if(key ===  $scope.mail_attachments[i].key){
                $scope.mail_attachments.splice(i, 1);
                break;
            }
        }
    };

    $scope.gm_mail_send = function(){
        var info = generatePostInfo('', '/gm', 'mail',
            {
                title: $("#mailTitle").val(),
                content: $("#mailContent").val(),
                attachment:$scope.mail_attachments,
                palyerCond:$scope.mail_playerConds,
                playerOpenIds:$("#playerOpenIds").val(),
                send:1
            });
        $http(info).success(function(data, status, headers, config){
            $scope.mail_attachments.push(data);
        }).error(
            function(err){
                $scope.messages.push(err);
            });
    };

    $scope.gm_mail_save = function(){

    };
});

myAppModule.controller('InitController', function($scope, $http) {
    $scope.title = "";
    $scope.disableSetup = false;
    $scope.message = '';
    $scope.init = function()  {
        $scope.disableSetup = true;
        $scope.message = 'Creating...';
        var info = generatePostInfo('', '/init', 'setup',{
                username:$("#username").val(),
                password:$("#password").val(),
                accSvrIp:$("#accSvrIp").val(),
                accSvrPort:$("#accSvrPort").val()});
        $http(info).success(function(data, status, headers, config){
            $scope.disableSetup = false;
            $scope.message = 'Creating... done';
            window.location.href = data;
        }).error(
            function(err){
                $scope.message = err;
            });
    };
    /*
    $scope.createMoonRobot = function()  {
        $scope.disableCreateButton = true;
        $scope.message = 'Creating...';
        $http.get('/init/createMoonRobot/'+ $scope.accSrv + '/'+$scope.astSrv).success(function(data, status, headers, config){
            $scope.disableCreateButton = false;
            $scope.message = 'Creating... done,' + JSON.stringify(data);
        });
    };
    */
});

myAppModule.controller('AccountController', function($scope, $http) {
    $scope.messages = [];
    $scope.qualityText = [
        {value: 1, text: '白'},
        {value: 2, text: '绿'},
        {value: 3, text: '蓝'},
        {value: 4, text: '紫'},
        {value: 5, text: '金'}
    ];
    $scope.stars = [
        {value: 1, text: '1'},
        {value: 2, text: '2'},
        {value: 3, text: '3'},
        {value: 4, text: '4'},
        {value: 5, text: '5'}
    ];

    $scope.getQualityText = function(q){
        var n = parseInt(q);
        for(var i  = 0; i < $scope.qualityText.length; ++i){
            if( $scope.qualityText[i].value === n){
                return  $scope.qualityText[i].text;
            }
        }
        return 'none';
    };



    $scope.saveSpirit = function(info, spId) {
        $http(generatePostInfo($scope.user.uid, '/account', 'saveSpirit',info)).success(function (data) {
            $scope.messages.push('done');
            $scope.user.data.spirits[spId] = data;
        }).error(
            function(err){
                $scope.messages.push(err);
        });
    };

    $scope.userName = null;
    $scope.user = null;
    $scope.spirit = null;
    $scope.getUser = function()  {
        /*
        if(!!$scope.userName )
        $http.get('/account/user/' +  $scope.userName).success(function(data, status, headers, config){
            $scope.user = data;
        });
        */
    };



    $scope.searchPlayer = function()  {
        var info = {};

        info.searchType = $('input[name="input_searchType"]:checked').val();
        info.val = $("#input_searchVal").val();
        $http(generatePostInfo('', '/account', 'search', info)).success(function(data, status, headers, config){
            $scope.user = data;
            $scope.messages.push('done');
        }).error(
            function(err){
                $scope.user = {};
                $scope.messages.push(err);
        });
    };

    $scope.setEnergy = function()  {
        if(!$scope.user){
            return;
        }
        $http(generatePostInfo($scope.user.uid, '/account', 'setEnergy', {energy:$("#input_energy").val()})).success(function(data, status, headers, config){
            $scope.user.data.energy = data;
            $scope.messages.push('done');
        }).error(function(err){
            $scope.messages.push(err);
        });
    };

    $scope.passLevel = function()  {
        if(!$scope.user){
            return;
        }
        $http(generatePostInfo($scope.user.uid,'/account',  'passLevel', {level : $("#input_level").val()})).success(function(data, status, headers, config){
            $scope.messages.push('done');
        }).error(function(err){
            $scope.messages.push(err);
        });
    };

    $scope.passAllLevel = function()  {
        if(!$scope.user){
            return;
        }

        $http(generatePostInfo($scope.user.uid,'/account',  'passAllLevel', {})).success(function(data, status, headers, config){
            $scope.messages.push('done');
        }).error(function(err){
            $scope.messages.push(err);
        });
    };

    $scope.unlockAllSystem = function()  {
        if(!$scope.user){
            return;
        }

        $http(generatePostInfo($scope.user.uid,'/account',  'unlockAllSystem', {})).success(function(data, status, headers, config){
            $scope.messages.push('done');
        }).error(function(err){
            $scope.messages.push(err);
        });
    };

    $scope.addAllSpirit = function()  {
        if(!$scope.user){
            return;
        }

        $http(generatePostInfo($scope.user.uid, '/account', 'addAllSpirit', {})).success(function(data, status, headers, config){
            $scope.user.data.magics = data;
            $scope.messages.push('done');
        }).error(function(err){
            $scope.messages.push(err);
        });
    };

    $scope.learnSkill = function()  {
        if(!$scope.user){
            return;
        }

        $http(generatePostInfo($scope.user.uid, '/account', 'learnSkill', {skillId:$scope.skillId})).success(function(data, status, headers, config){
            $scope.user.data.skills = data;
            $scope.messages.push('done');
        }).error(function(err){
            $scope.messages.push(err);
        });
    };

    $scope.setHeroLevel = function()  {
        if(!$scope.user){
            return;
        }
        $http(generatePostInfo($scope.user.uid, '/account', 'setHeroLevel', {level:$("#input_playerlevel").val()})).success(function(data, status, headers, config){
            $scope.user.data.level = data;
            $scope.messages.push('done');
        }).error(function(err){
            $scope.messages.push('err');
            $scope.messages.push(err);
        });
    };

    $scope.setGuideStep = function()  {
        if(!$scope.user){
            return;
        }
        $http(generatePostInfo($scope.user.uid,'/account',  'setGuideStep', {guideStep:$("#input_guideStep").val()})).success(function(data, status, headers, config){
            $scope.user.data.guideStep = data;
            $scope.messages.push('done');
        }).error(function(err){
            $scope.messages.push(err);
        });
    };

    $scope.addAllItem500 = function()  {
        $http(generatePostInfo($scope.user.uid, '/account', 'addAllItem500', {})).success(function(data, status, headers, config){
            $scope.user.data.items = data;
            $scope.messages.push('done');
        }).error(function(err){
            $scope.messages.push(err);
        });
    };

    $scope.addAllMagic500 = function()  {
        $http(generatePostInfo($scope.user.uid, '/account', 'addAllMagic500', {})).success(function(data, status, headers, config){
            $scope.user.data.magics = data;
            $scope.messages.push('done');
        }).error(function(err){
            $scope.messages.push(err);
        });
    };

    $scope.getLocalTime = function(utcTime){
        return new Date(utcTime);
    };

    $scope.addItem = function(){
        $http(generatePostInfo($scope.user.uid, '/account', 'addItem', {itemId:$scope.itemId, itemCount:$scope.itemCount})).success(function(data, status, headers, config){
            $scope.user.data.items[$scope.itemId ] = data;
            $scope.itemId = "";
            $scope.itemCount = "";
            $scope.messages.push('done');
        }).error(function(err){
            $scope.itemId = "";
            $scope.itemCount = "";
            $scope.messages.push(err);
        });
    };

    $scope.addMagic = function(){
        $http(generatePostInfo($scope.user.uid, '/account', 'addMagic', {magicId:$scope.magicId, magicCount:$scope.magicCount})).success(function(data, status, headers, config){
            $scope.user.data.magics[$scope.magicId ] = data;
            $scope.magicId = "";
            $scope.magicCount = "";
            $scope.messages.push('done');
        }).error(function(err){
            $scope.magicId = "";
            $scope.magicCount = "";
            $scope.messages.push(err);
        });
    };

    $scope.removeSpirit = function(spId){
        $http(generatePostInfo($scope.user.uid, '/account', 'removeSpirit', {spId:spId})).success(function(data, status, headers, config){
            $scope.messages.push('done');
            delete $scope.user.data.spirits[spId];
        }).error(function(err){
            $scope.messages.push(err);
        });
    };

    $scope.addSpirit = function(){
        $http(generatePostInfo($scope.user.uid, '/account', 'addSpirit', {newSpId:$scope.newSpId})).success(function(data, status, headers, config){
            $scope.user.data.spirits[$scope.newSpId] = data;
            $scope.newSpId = "";
            $scope.messages.push('done');
        }).error(function(err){
            $scope.newSpId = "";
            $scope.messages.push(err);
        });
    };

    $scope.$watch('tId', function(s) {
        $scope.transformer = s;
    });

    $scope.selectUser = {};
});