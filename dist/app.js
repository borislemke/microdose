"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http = require("http");
var route_stack_1 = require("./route_stack");
var router_1 = require("./router");
var uApp = /** @class */ (function () {
    function uApp() {
    }
    uApp.bootstrap = function (app, config) {
        // Default port if not provided
        if (typeof config.port === 'undefined') {
            throw new Error('`config.port` is not defined.');
        }
        // Default server if not provided
        config.server = config.server || http;
        if (config.turboMode) {
            /**
             * Checks if the developer is attempting to use path patterns
             * despite enabling Turbo Mode.
             */
            router_1.PartyRouterStack.forEach(function (_stack) {
                var conflictingPathUse = _stack.routerStack
                    .find(function (_childStack) { return _childStack.path; });
                var conflictingPath = conflictingPathUse.path;
                if (conflictingPathUse) {
                    console.warn('\nWARNING: Handler with path pattern '
                        + conflictingPath + ' will be ignored in Turbo Mode.');
                }
            });
            uApp.TURBO_MODE = true;
        }
        var topRoutes = router_1.PartyRouterStack
            .find(function (_stack) { return _stack.routerName === app.name; });
        if (!topRoutes) {
            console.warn('\nWARNING: No root handlers found. If you intended'
                + ' not to add any RouterStack items to the main Router, ignore'
                + ' this message.');
        }
        else {
            route_stack_1.RouteStack.addStack.apply(route_stack_1.RouteStack, topRoutes.routerStack);
        }
        var server = config.server
            .createServer(function (req, res) { return route_stack_1.RouteStack.matchRequest(req, res); });
        return new Promise(function (resolve, reject) {
            server.listen(config.port, function (err) {
                if (err) {
                    reject(err);
                }
                if (process.env.NODE_ENV === 'development') {
                    if (config.turboMode) {
                        console.warn('\nWARNING: Turbo Mode is enabled. Path matching is'
                            + ' disabled and request will only match request methods.');
                    }
                }
                resolve();
            });
        });
    };
    uApp.TURBO_MODE = false;
    return uApp;
}());
exports.uApp = uApp;
//# sourceMappingURL=app.js.map