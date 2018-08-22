"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var middleware_1 = require("./middleware");
var ensure_url_1 = require("./utils/ensure_url");
var route_stack_1 = require("./route_stack");
exports.PartyRouterStack = [];
function uRouter(config) {
    if (config === void 0) { config = {}; }
    var _a = config.prefix, prefix = _a === void 0 ? '' : _a, _b = config.children, children = _b === void 0 ? [] : _b, middleware = config.middleware;
    return function (target) {
        if (children) {
            children.forEach(function (rChild) {
                /**
                 * Look up for a RouterStack that is a direct child of the current RouterStack
                 * @type {IPartyStack}
                 */
                var partyRouterChildren = exports.PartyRouterStack.find(function (r) { return r.routerName === rChild.name; });
                if (partyRouterChildren && partyRouterChildren.routerStack.length) {
                    exports.PartyRouterStack.splice(exports.PartyRouterStack.indexOf(partyRouterChildren), 1);
                    partyRouterChildren
                        .routerStack
                        .forEach(function (cRoute) {
                        cRoute.path = ensure_url_1.ensureURIValid(prefix, rChild.prefix, cRoute.path);
                        if (middleware && middleware.length) {
                            cRoute.handler = middleware_1.wrapMiddleware(middleware, cRoute.handler);
                        }
                        route_stack_1.RouteStack.addStack(cRoute);
                    });
                }
            });
        }
        var rStack = exports.PartyRouterStack
            .find(function (_stack) { return _stack.routerName === target.name; });
        rStack && rStack.routerStack && rStack.routerStack.forEach(function (stack) {
            // Apply Router and Router children scoped `prefix` if provided
            stack.path = ensure_url_1.ensureURIValid(prefix, stack.path);
            /**
             * Wrap all functions inside a MiddlewareFunction if provided.
             * The order of the middleware MUST be reversed before being???
             * applied.
             */
            if (middleware && middleware.length) {
                stack.handler = middleware_1.wrapMiddleware(middleware, stack.handler);
            }
            route_stack_1.RouteStack.addStack(stack);
        });
        return target;
    };
}
exports.uRouter = uRouter;
//# sourceMappingURL=router.js.map