"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var router_1 = require("./router");
var ensure_url_1 = require("./utils/ensure_url");
var baseMethod = function (method) { return function (route, middleware) {
    if (arguments.length > 2) {
        throw new Error('@MicroRouter[method] requires exactly 2 parameters. 3 given');
    }
    // case: @MicroRouter.Get()
    if (typeof route === 'undefined' && typeof middleware === 'undefined') {
        middleware = null;
        route = '/';
    }
    // case: @MicroRouter.Get(middlewareFunction)
    if (typeof route === 'function' && typeof middleware === 'undefined') {
        middleware = route;
        route = '/';
    }
    // Ensures that the routerStack path is valid
    // e.g //some-path/that//is/not-valid/// -> /some-path/that/is/not-valid
    /** TODO(opt): We might need to allow this? */
    route = ensure_url_1.ensureURIValid(route);
    return function (target, descriptorKey, descriptor) {
        // Clone original handler function
        var handler = descriptor.value;
        var indexOfPartyStack = -1;
        var existingPartyStack = router_1.PartyRouterStack.find(function (_stack, index) {
            indexOfPartyStack = index;
            return _stack.routerName === target.constructor.name;
        });
        if (middleware) {
            var originalFunction_1 = handler;
            handler = function (req, res) {
                return middleware(req, res, function (req2, res2) {
                    return originalFunction_1(req2 || req, res2 || res);
                });
            };
        }
        var stackItem = {
            method: method,
            route: route,
            handler: handler
        };
        if (!existingPartyStack) {
            router_1.PartyRouterStack.push({
                routerName: target.constructor.name,
                routerStack: [stackItem]
            });
        }
        else {
            router_1.PartyRouterStack[indexOfPartyStack].routerStack.push(stackItem);
        }
        return descriptor.value;
    };
}; };
exports.MicroMethod = {
    Get: baseMethod('GET'),
    Post: baseMethod('POST'),
    Put: baseMethod('PUT'),
    Patch: baseMethod('PATCH'),
    Delete: baseMethod('DELETE')
};
//# sourceMappingURL=methods.js.map