/**
 * Created by chuan.jin on 2016/6/8.
 */

app.appModule
    .controller('userCtrl', [
        'uiGridConstants',
        'authService',
        'userWebService',
        function (uiGridConstants, authService, userWebService) {
            var context = this;

            context.searchNuid = '';
            //TODO:click search then set disable
            context.hasAuth = authService.getAuthorities().indexOf('gm') < 0;
            context.searchPlayer = function () {
                var searchInfo = {
                    nuid: context.searchNuid
                };
                userWebService.getPlayer(searchInfo)
                    .then(function (data, status, headers, config) {
                        context.user = data;
                    })
                    .catch(function (err) {
                        context.user = {};
                    });
            };

            /*context.selectOption = [
             'UId',
             'NumberId',
             'OpenId',
             'AccountName',
             'NickName'
             ];*/

            context.spiritGrid = {
                columnDefs: [
                    {displayName: '元神Name', field: 'name'},
                    {displayName: '元神Id', field: 'id', enableSorting: false},
                    {displayName: '等级', field: 'level', enableSorting: false},
                    {displayName: '星级', field: 'rank', enableSorting: false},
                    {displayName: '品质', field: 'quality', enableSorting: false},
                    {displayName: '品质等级', field: 'qualityLevel', enableSorting: false}
                ],
                data: [{name: '元神1', id: 1, level: 3, rank: 1, quality: '黄', qualityLevel: 2}, {
                    name: '元神2',
                    id: 2,
                    level: 4,
                    rank: 1,
                    quality: '黄',
                    qualityLevel: 1
                }]
            };

            context.magicGrid = {
                columnDefs: [
                    {displayName: '法宝Id', field: 'id', enableSorting: false},
                    {displayName: '数量', field: 'count', enableSorting: false}
                ],
                data: [{id: 1, count: 3}, {id: 2, count: 2}, {id: 3, count: 4}]
            };

            context.itemGrid = {
                columnDefs: [
                    {displayName: '道具Id', field: 'id', enableSorting: false},
                    {displayName: '数量', field: 'count', enableSorting: false}
                ],
                data: [{id: 1, count: 3}, {id: 2, count: 2}, {id: 3, count: 4}]
            };

            context.skillGrid = {
                columnDefs: [
                    {displayName: '技能Name', field: 'name'},
                    {displayName: '技能Id', field: 'id', enableSorting: false},
                    {displayName: '技能开启', field: 'get'}
                ],
                data: [{name: '技能1', id: 1, get: true}, {name: '技能2', id: 2, get: true}, {
                    name: '技能3',
                    id: 3,
                    get: true
                }]
            };

            context.equipGrid = {
                columnDefs: [
                    {displayName: '装备栏位', field: 'position'},
                    {displayName: '装备Id', field: 'id', enableSorting: false},
                    {displayName: '强化', field: 'ultra'}
                ],
                data: [{position: '头', id: 1, ultra: 1}, {position: '武器', id: 2, ultra: 2}, {
                    position: '衣服',
                    id: 3,
                    ultra: 3
                }]
            };
        }]);