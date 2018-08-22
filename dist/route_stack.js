"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var parseUrl = require("parseurl");
var response_1 = require("./response");
var request_1 = require("./request");
var status_codes_1 = require("./status_codes");
var app_1 = require("./app");
var earlyReturn = function (res) {
    res.writeHead(status_codes_1.HTTPStatusCodes.NOT_FOUND, response_1.uResponseBuilder.defaultResponseHeaders);
    res.end('Not Found');
};
var RouteStackC = /** @class */ (function () {
    function RouteStackC() {
        /**
         * All path stack collected from the MicroMethod decorator will
         * end up here to be path-matched for each incoming request.
         * Filtering by method first has significant performance impact
         * @type {RouteStackGroup[]}
         */
        this.routeStack = {
            GET: [],
            POST: [],
            PUT: [],
            DELETE: [],
            PATCH: []
        };
    }
    RouteStackC.prototype.addStack = function () {
        var _this = this;
        var stackItems = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            stackItems[_i] = arguments[_i];
        }
        // Ensure stackItems is an array
        stackItems = [].concat(stackItems);
        // Adds all provided path stack to the _routeStack property
        stackItems.forEach(function (_stack) {
            var targetStack = _this.routeStack[_stack.method];
            targetStack.push(_stack);
        });
    };
    /**
     * Make as efficient as possible, this is the only function
     * that is run to map incoming requests.
     * Treat this as the most performance sensitive function of all
     */
    RouteStackC.prototype.matchRequest = function (req, res) {
        var matchingRoutesStack = this.routeStack[req.method.toUpperCase()];
        // Early return if routerStack by method has no handlers
        if (!matchingRoutesStack.length) {
            earlyReturn(res);
            return;
        }
        // If TURBO_MODE is enabled, we only need to match the method as there can
        // only be a single handler function of each method. Path matching is disabled
        if (app_1.uApp.TURBO_MODE) {
            var mResponse = response_1.uResponseBuilder.create(res);
            var mRequest = request_1.uRequestBuilder.create(req);
            // Retrieve first handler of the matching router stack
            return matchingRoutesStack[0].handler(mRequest, mResponse);
        }
        // The URL of the current request
        var incomingRequestPath = parseUrl(req).pathname;
        // Matching routerStack for the current incoming request
        var routeMatch;
        // Found parameters inside path path
        var params = {};
        // Incoming request URL split by slashes. Used for path matching later
        // e.g /users/userName => ['users', 'username']
        var pathChunks = incomingRequestPath.replace(/^\/+|\/+^/, '').split('/');
        for (var i = 0; i < matchingRoutesStack.length; i++) {
            // The currently iterated routerName stack
            var curr = matchingRoutesStack[i];
            // Break loop if exact root match found
            if (curr.path === incomingRequestPath) {
                routeMatch = curr;
                break;
            }
            // Checks if the currently iterated routeStack has a parameter identifier.
            // If it does not, immediately continue loop. Regex checking function below
            // this point is expensive, we want to prevent from doing it if not necessary.
            // e.g @MicroMethod.Post('/users/:userId') or ('/foo*')
            if (!/\/?:(.*)|\*/g.test(curr.path))
                continue;
            var matchChunks = curr.path.replace(/^\/+|\/+^/, '').split('/');
            // Continue loop early if request URL and currently iterated
            // router stack does not match in chunks length
            if (pathChunks.length !== matchChunks.length)
                continue;
            // Iterate over route patterns
            for (var i_1 = 0; i_1 < matchChunks.length; i_1++) {
                var capture = matchChunks[i_1];
                if (/^:/.test(capture)) {
                    params[capture.replace(/^:/i, '')] = pathChunks[i_1];
                }
            }
            // If any matching params were found
            // mark the currently iterated routerStack as a match
            // and break out of the loop
            if (Object.keys(params).length) {
                routeMatch = curr;
                break;
            }
        }
        /**
         * TODO(production): Allow custom override of not found function
         * @date - 5/27/17
         * @time - 2:54 AM
         */
        if (!routeMatch) {
            // No matching path handler found return 404
            earlyReturn(res);
            return;
        }
        // Create the request and response object only after a route match has been found
        var uResponse = response_1.uResponseBuilder.create(res);
        var uRequest = request_1.uRequestBuilder.create(req);
        // Attach params to current request context
        if (params) {
            uRequest.params = params;
        }
        // Execute matching route handler
        routeMatch.handler(uRequest, uResponse);
    };
    return RouteStackC;
}());
exports.RouteStackC = RouteStackC;
exports.RouteStack = new RouteStackC();
//# sourceMappingURL=route_stack.js.map