"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function toJSON(proto) {
    var jsoned = {};
    var toConvert = proto || this;
    Object.getOwnPropertyNames(toConvert).forEach(function (prop) {
        var val = toConvert[prop];
        // don't include those
        if (prop === 'toJSON' || prop === 'constructor') {
            return;
        }
        if (typeof val === 'function') {
            jsoned[prop] = val.bind(jsoned);
            return;
        }
        jsoned[prop] = val;
    });
    var inherited = Object.getPrototypeOf(toConvert);
    if (inherited !== null) {
        Object.keys(this.toJSON(inherited)).forEach(function (key) {
            if (!!jsoned[key] || key === 'constructor' || key === 'toJSON')
                return;
            if (typeof inherited[key] === 'function') {
                jsoned[key] = inherited[key].bind(jsoned);
                return;
            }
            jsoned[key] = inherited[key];
        });
    }
    return jsoned;
}
exports.toJSON = toJSON;
//# sourceMappingURL=class_to_object.js.map