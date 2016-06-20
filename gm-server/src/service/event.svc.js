/**
 * Created by chuan.jin on 2016/6/20.
 */
app.serviceModule.factory('eventService', [
    function () {
        var onEventFunc = {};
        return {
            on: function (type, f) {
                //event binding
                onEventFunc[type] = f;
            },
            trigger: function (type, data) {
                //event trigger
                for (var item in onEventFunc) {
                    if (item == type)
                        onEventFunc[item](data);
                }
            }
        }

    }]);