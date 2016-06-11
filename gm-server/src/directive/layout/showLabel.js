/**
 * Created by chuan.jin on 2016/5/31.
 */

app.directiveModule.directive('show', function () {
    return {
        restrict: 'ECMA',
        template: '<p>name: {{name}}</p>',
        scope: {
            name: '@forName'
        }
    }
})
    .controller('showCtrl', ['$scope', function ($scope) {
        $scope.Name = 'Jin';
    }]);