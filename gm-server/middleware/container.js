/**
 * Created by chuan.jin on 2016/6/7.
 */
var container;

module.exports = function() {
    if (container) {
        return container;
    }
    return initContainer();
};

function initContainer() {
    container = {};
    return container;
}