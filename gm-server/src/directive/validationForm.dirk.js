/**
 * Created by  chuan.jin on 2016/6/14.
 */
app.directiveModule.directive("validationForm", [
    '$parse',
    '$timeout',
    '$q',
    '$mdDialog',
    /*'message',*/
    function ($parse, $timeout, $q, $mdDialog) {

        var process = {
            'validate-required': function (element, ngModel) {
                var attrVal = element.attr('validate-required');

                if (!ngModel) {
                    element.addClass('has-error');
                    return attrVal;
                } else {
                    element.removeClass('has-error');
                }
            },
            'validate-format': function (element, ngModel) {
                var attrVal = element.attr('validate-format'),
                    text = element.attr('validate-format-text'),
                    re = new RegExp(attrVal);

                if (!re.test(ngModel)) {
                    return text;
                }
            },
            'validate-url-format': function (element, ngModel) {
                var attrVal = element.attr('validate-url-format'),
                    re = /^(http|ftp|https):\/\/[^\s]+$/;

                if (!re.test(ngModel)) {
                    return attrVal;
                }
            },
            'validate-min': function (element, ngModel) {
                var min = parseFloat(element.attr('min')),
                    attrVal = element.attr('validate-min');

                if (parseFloat(ngModel) < min) {
                    return attrVal;
                }
            },
            'validate-gt': function (element, ngModel) {
                var min = parseFloat(element.attr('min')),
                    attrVal = element.attr('validate-gt');

                if (parseFloat(ngModel) <= min) {
                    return attrVal;
                }
            }
        };

        function validate(elements, scope) {
            var dfd = $q.defer(),
                result;

            elements.each(function () {
                var self = $(this);
                self.data('init', false);

                if (result) {
                    return;
                }
                var attrs = this.attributes,
                    model = $parse(self.attr('ng-model'))(scope) || self.val();
                for (var index in attrs) {
                    var method = process[attrs[index].name];

                    result = method && method(self, model);

                    if (result) {
                        dfd.reject(result);
                        break;
                    }
                }
            });

            dfd.resolve();

            return dfd.promise;
        }

        return {
            priority: 1, // execute before ng-click (0)
            require: '?ngSubmit',
            link: function (scope, element, attrs) {
                element = $(element);
                /*element = angular.element(element);*/
                var elements;

                var check = function (element, value) {
                    if (value === '' || value === undefined || value === null) {
                        element.addClass('has-error');
                    } else {
                        element.removeClass('has-error');
                    }
                };

                //elements.each(function () {
                //    var self = $(this);
                //    self.data('init', true);
                //
                //    self.on('input propertychange change', function () {
                //        var target = $(this);
                //
                //        if (target.data('init')) {
                //            return;
                //        }
                //
                //        target.data('init', false);
                //
                //        check(target, target.val());
                //    });
                //});

                var bindListener = function (eles) {
                    eles.each(function () {
                        var self = $(this);

                        if (!self.data('hasBinded')) {
                            self.on('keyup change', function () {
                                var target = $(this);

                                check(target, target.val());
                                return true;
                            });
                            self.data('hasBinded', true)
                        }
                    });
                };

                //bindListener(elements);

                $timeout(function () {
                    // Disable ng-click event propagation
                    element.off('submit');
                    element.on('submit', function (e) {
                        debugger;
                        e.preventDefault();
                        elements = element.find('[name]');
                        bindListener(elements);
                        validate(elements, scope).then(function () {
                            $parse(attrs.ngSubmit)(scope);
                        }).catch(function (result) {
                            /*result && message.error(result);*/
                            result && $mdDialog.show(
                                $mdDialog.alert()
                                    .clickOutsideToClose(true)
                                    .title('注意')
                                    .textContent(result)
                                    .ariaLabel('Alert')
                                    .ok('确定')
                            );
                        });
                    });
                });
            }
        };
    }]);

/**
 *
 */
//app.directiveModule.directive('validateRequired', [
//    function () {
//        return {
//            restrict: "A",
//            link: function (scope, element, attrs) {
//                element = $(element);
//
//                var check = function (element, value) {
//                    if (value === '' || value === undefined || value === null) {
//                        element.addClass('has-error');
//                    } else {
//                        element.removeClass('has-error');
//                    }
//                };
//
//                element.on('input propertychange', function () {
//                    check(element, element.val());
//                });
//            }
//        }
//    }
//]);