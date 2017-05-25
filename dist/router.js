"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var route_stack_1 = require("./route_stack");
var ensure_url_1 = require("./utils/ensure_url");
exports.PartyRouterStack = [];
function MicroRouter(config) {
    if (config === void 0) { config = null; }
    return function (target) {
        /** TODO(opt): Optimise if conditions */
        if (config) {
            var routerPrefix_1 = config.prefix || '';
            if (config.children) {
                config.children.forEach(function (_routerChild) {
                    /**
                     * Look up for a RouterStack that is a direct child of the current RouterStack
                     * @type {PartyStack}
                     */
                    var partyRouterChildren = exports.PartyRouterStack.find(function (_stack, index) {
                        return _stack.routerName === _routerChild.router.name;
                    });
                    /**
                     * If the current RouterStack has any children,
                     * we want to apply the prefix for each of their handlers
                     */
                    if (partyRouterChildren && partyRouterChildren.routerStack.length) {
                        partyRouterChildren
                            .routerStack
                            .forEach(function (_childRoute) {
                            _childRoute.path = ensure_url_1.ensureURIValid(routerPrefix_1, _routerChild.prefix, _childRoute.path);
                            if (config.middleware && config.middleware.length) {
                                var originalHandler_1 = _childRoute.handler;
                                config.middleware
                                    .forEach(function (_middleware) {
                                    _childRoute.handler = function (req, res) {
                                        return _middleware(req, res, function (req2, res2) {
                                            return originalHandler_1(req2 || req, res2 || res);
                                        });
                                    };
                                });
                            }
                            route_stack_1.RouteStack.addStack(_childRoute);
                        });
                    }
                });
            }
            if (config.middleware || config.prefix) {
                var _routerStack_1 = exports.PartyRouterStack.find(function (_stack) { return _stack.routerName === target.name; });
                if (_routerStack_1) {
                    _routerStack_1.routerStack = _routerStack_1.routerStack.map(function (_stack) {
                        // Apply Router and Router children scoped `prefix` if provided
                        _stack.path = ensure_url_1.ensureURIValid(routerPrefix_1, _stack.path);
                        return _stack;
                    });
                    /**
                     * Wrap all functions inside a MiddlewareFunction if provided
                     */
                    if (config.middleware) {
                        config.middleware.forEach(function (_middleware) {
                            _routerStack_1.routerStack.forEach(function (_stack, index) {
                                var originalHandler = _stack.handler;
                                _stack.handler = function (req, res) {
                                    return _middleware(req, res, function (req2, res2) {
                                        return originalHandler(req2 || req, res2 || res);
                                    });
                                };
                            });
                        });
                    }
                }
            }
        }
        return target;
    };
}
exports.MicroRouter = MicroRouter;
//# sourceMappingURL=router.js.map