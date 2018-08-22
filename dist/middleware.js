"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Wraps a function inside an array of middlewares / functions.
 * Eg:
 * middlewares = [
 *   fn1,
 *   fn2
 * ]
 * const fn3
 * const fn4 = wrapMiddleware(middlewares, fn3)
 * fn4 => fn2((...params) => fn1((...params) => fn3(...params)))
 * @param middleware
 * @param originalMethod
 */
exports.wrapMiddleware = function (middleware, originalMethod) {
    middleware.reverse()
        .forEach(function (_middleware) {
        var originalHandler = originalMethod;
        originalMethod = function (req, res) {
            _middleware(req, res, function (req2, res2) {
                originalHandler(req2 || req, res2 || res);
            });
        };
    });
    return originalMethod;
};
function uMiddleware() {
    var middleware = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        middleware[_i] = arguments[_i];
    }
    return function (target, propertyKey, descriptor) {
        descriptor.value = exports.wrapMiddleware(middleware, descriptor.value);
        return descriptor;
    };
}
exports.uMiddleware = uMiddleware;
//# sourceMappingURL=middleware.js.map