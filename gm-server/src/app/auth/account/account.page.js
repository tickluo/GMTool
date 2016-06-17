/**
 * Created by chuan.jin on 2016/6/14.
 */

app.appModule
    .controller('accountCtrl', [
        'accountWebService',
        'gridService',
        '$q',
        '$scope',
        '$mdDialog',
        '$mdMedia',
        function (accountWebService, gridService, $q, $scope, $mdDialog, $mdMedia) {
            var context = this;
            context.selectQuery = '';
            context.query = '';
            context.selectQuerys = ['userName', 'name', 'role', 'blockedMsg'];
            context.selectAttachmentTypes = ['用户名', '名称', '角色', '状态'];

            context.fetchSearch = function () {
                if (context.selectQuery === '状态') {
                    postData.query = {
                        type: 'blocked',
                        search: context.query === '封禁'
                    };
                }
                else {
                    postData.query = {
                        type: context.selectQuerys[context.selectAttachmentTypes.indexOf(context.selectQuery)],
                        search: context.query
                    };
                }

                $scope.getTable();
            };

            $scope.showConfirm = function (ev, user) {
                $mdDialog.show({
                    controller: editAccountCtrl,
                    controllerAs: 'ctrl',
                    locals: {
                        user: user
                    },
                    /*pay attention here important !!!! Currently while using scope: $scope will destroy the $scope of parent controller.
                     This makes the dynamic dialog only usable once.*/
                    scope: $scope.$new(),
                    templateUrl: 'app/auth/account/editDialog.tpl.html',
                    /*parent: angular.element(document.querySelector('#accountManager')),*/
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true
                })
                    .then(function (answer) {
                        $scope.status = 'You said the information was "' + answer + '".';
                    }, function () {
                        $scope.status = 'You cancelled the dialog.';
                    });
                $scope.$watch(function () {
                    return $mdMedia('xs') || $mdMedia('sm');
                }, function (wantsFullScreen) {
                    $scope.customFullscreen = (wantsFullScreen === true);
                });
            };

            var postData = {
                PageIndex: 1,
                PageSize: 20,
                OrderBy: 'role',
                Desc: true
            };

            context.accountGrid = gridService.getGridOptions({
                columnDefs: [
                    {displayName: '名称', field: 'name'},
                    {displayName: '用户名', field: 'userName'},
                    {displayName: '用户Id', field: 'uid'},
                    {
                        displayName: '角色', field: 'role', enableSorting: true,
                        cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                            if (grid.getCellValue(row, col) === 'Observer') {
                                return 'gridCol-green';
                            } else {
                                return 'gridCol-blue';
                            }
                        }
                    },
                    {
                        displayName: '状态',
                        field: 'blockedMsg',
                        enableSorting: true,
                        cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                            if (grid.getCellValue(row, col) === '封禁') {
                                return 'gridCol-red';
                            } else {
                                return 'gridCol-blue';
                            }
                        }
                    },
                    {
                        displayName: '操作', name: 'edit',
                        width: '70', enableColumnMenu: false,
                        cellTemplate: '<md-button  ng-click="grid.appScope.showConfirm($event,row.entity)" style="position: relative;top:-5px " class="md-icon-button" aria-label="More">' +
                        '<md-icon md-svg-icon="../../../asset/svg/more_vert.svg"></md-icon>' +
                        '</md-button>'
                    }
                ],
                onRegisterApi: function (gridApi) {
                    context.gridApi = gridApi;
                    context.gridApi.pagination.on.paginationChanged($scope, function (pageIndex, pageSize) {
                        $scope.ctrl.accountGrid.virtualizationThreshold = $scope.ctrl.accountGrid.paginationPageSize;
                        /*context.data.PageIndex = pageIndex;
                         context.data.PageSize = pageSize;*/
                        postData.PageIndex = pageIndex;
                        postData.PageSize = pageSize;
                        $scope.getTable();
                    });

                    context.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                        /*if (sortColumns.length == 0) {
                         $scope.data.OrderBy = null;
                         $scope.data.Desc = null;
                         } else {
                         $scope.data.OrderBy = sortColumns[0].name;
                         $scope.data.Desc = sortColumns[0].sort.direction === 'desc';
                         }
                         postData.OrderBy = $scope.data.OrderBy;
                         postData.Desc = $scope.data.Desc;*/
                        if (sortColumns.length == 0) {
                            postData.OrderBy = null;
                            postData.Desc = null;
                        }
                        else {
                            postData.OrderBy = sortColumns[0].name;
                            postData.Desc = sortColumns[0].sort.direction === 'desc';
                        }

                        $scope.getTable();
                    });

                    /*context.gridApi.core.on.columnVisibilityChanged($scope, function () {
                     gridService.saveState($scope.controllerName, $scope);
                     });

                     gridService.restoreState(context.controllerName, $scope);*/
                }
            });

            $scope.getTable = function () {
                context.isTableLoading = true;
                initTable();
            };

            function initTable() {
                var dfd = $q.defer();
                accountWebService.getAccounts(postData).then(function (result) {
                    if (context.gridApi) {
                        context.gridApi.grid.options.totalItems = result.data.AllRecordCount;
                    }

                    if (result.data.data) {
                        context.accountGrid.data = result.data.data.map(function (a) {
                            a.blockedMsg = a.blocked ? '封禁' : '正常';
                            return a;
                        });
                    }

                    dfd.resolve();
                }).catch(function (err) {
                    dfd.reject();
                }).finally(function () {
                    context.isTableLoading = false;
                });

                return dfd.promise;
            }

            $scope.getTable()
        }]);

function editAccountCtrl($scope, $mdDialog, accountWebService, user) {
    $scope.user = user;
    $scope.hasAuth = user.role !== 'Observer';
    $scope.blocked = user.blocked;
    $scope.msg = user.blocked ? '解禁' : '封禁';
    $scope.hide = function () {
        $mdDialog.hide();
    };
    $scope.cancel = function () {
        $mdDialog.cancel();
    };
    $scope.authAccount = function () {
        accountWebService.authAccount({uid: user.uid})
            .then(function (res) {
                $scope.getTable();
                $scope.hide();
            })
    };
    $scope.blockAccount = function () {
        accountWebService.blockAccount({uid: user.uid, blocked: !user.blocked})
            .then(function (res) {
                $scope.getTable();
                $scope.hide();
            })
    };
}