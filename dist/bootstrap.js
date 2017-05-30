"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http = require("http");
var route_stack_1 = require("./route_stack");
var credits_1 = require("./utils/credits");
var router_1 = require("./router");
exports.MicroBootstrap = function (serverApp, config, cb) {
    if (typeof config === 'object') {
        // Default port if not provided
        config.port || (config.port = 3000);
        // Default server if not provided
        config.server || (config.server = http);
        if (config.turboMode) {
            /**
             * Checks if the developer is attempting to use path patterns
             * despite enabling Turbo Mode.
             */
            router_1.PartyRouterStack.forEach(function (_stack) {
                var conflictingPathUse = _stack.routerStack.find(function (_childStack) { return _childStack.path; });
                if (conflictingPathUse) {
                    console.log('');
                    console.log('\x1b[33m%s\x1b[0m', 'WARNING: Handler with path pattern ' + conflictingPathUse.path
                        + ' will be ignored in Turbo Mode.\n');
                }
            });
            /**
             * TODO(global): Do not use global namespace
             * @date - 5/26/17
             * @time - 12:10 PM
             */
            Object.defineProperty(global, 'TURBO_MODE', {
                get: function () { return true; }
            });
        }
    }
    // Config passed as number, perceive as port argument
    if (typeof config === 'number') {
        config = {
            server: http,
            port: config
        };
    }
    // No config given, assign default port
    if (typeof config === 'undefined') {
        config = {
            port: 3000,
            server: http
        };
    }
    var topRoutes = router_1.PartyRouterStack.find(function (_stack) { return _stack.routerName === serverApp.name; });
    if (!topRoutes) {
        console.log('WARNING: No root handlers found. If you intended not to add any RouterStack' +
            'items to the main Router, ignore this message.');
    }
    else {
        route_stack_1.RouteStack.addStack.apply(route_stack_1.RouteStack, topRoutes.routerStack);
    }
    var server = config.server.createServer(function (req, res) { return route_stack_1.RouteStack.matchRequest(req, res); });
    /**
     * TODO(opt): Return as promise / callback
     * So the user knows for sure when microdose is up and running
     */
    server.listen(config.port, function () {
        if (process.env.NODE_ENV === 'development') {
            credits_1.microCredits(config.port);
            if (config.turboMode) {
                console.log('');
                console.log('\x1b[33m%s\x1b[0m', 'WARNING: Turbo Mode is enabled. Path matching is disabled and' +
                    ' request will only match request methods.\n');
            }
        }
        cb && cb();
    });
};
//# sourceMappingURL=bootstrap.js.map