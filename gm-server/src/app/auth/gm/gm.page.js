'use strict';

app.appModule
    .controller('gmCtrl', [
        'authService',
        '$timeout',
        'utilService',
        function (authService, $timeout, utilService) {
            var context = this;
            /*player*/
            context.selectPlayerType = '';
            context.minLevel = 0;
            context.maxLevel = 100;
            context.playerRules = [];
            context.selectPlayerTypes = ['角色等级', 'VIP等级'];

            var playerCounter = 0;

            context.addPlayerRule = function () {
                var newItem = {
                    itemId: ++playerCounter,
                    type: context.selectPlayerType,
                    minLevel: context.minLevel,
                    maxLevel: context.maxLevel,
                    rmActive: false
                };
                $timeout(function () {
                    context.playerRules.push(newItem)
                }, 10);
            };

            context.removePlayerRule = function (itemId) {
                context.playerRules.map(function (obj) {
                    obj.rmActive = obj.itemId == itemId;
                });
                $timeout(function () {
                    utilService.removeByAttr(context.playerRules, 'itemId', itemId)
                }, 200);
            };

            /*attachment */
            context.selectAttachmentType = '';
            context.attachmentId = '';
            context.attachmentCount = '';
            context.attenchments = [];
            context.selectAttachmentTypes = ['道具', '法宝', '元神'];

            var attachmentCounter = 0;

            context.addAttachment = function () {
                var newItem = {
                    itemId: ++attachmentCounter,
                    type: context.selectAttachmentType,
                    id: context.attachmentId,
                    count: context.attachmentCount,
                    rmActive: false
                };
                $timeout(function () {
                    context.attenchments.push(newItem)
                }, 10);
            };

            context.removeAttachment = function (itemId) {
                context.attenchments.map(function (obj) {
                    obj.rmActive = obj.itemId == itemId;
                });
                $timeout(function () {
                    utilService.removeByAttr(context.attenchments, 'itemId', itemId)
                }, 200);
            }
        }]);
