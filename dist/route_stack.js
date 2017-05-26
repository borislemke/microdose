"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var parseUrl = require("parseurl");
var response_1 = require("./response");
var request_1 = require("./request");
var status_codes_1 = require("./status_codes");
var earlyReturn = function (res) {
    res.writeHead(status_codes_1.HTTPStatusCodes.NOT_FOUND, { 'Content-Type': 'plain/text' });
    res.end('Not Found');
};
var RouteStackCompiler = (function () {
    function RouteStackCompiler() {
        /**
         * All path stack collected from the MicroMethod decorator will
         * end up here to be path-matched for each incoming request.
         * Filtering by method first has significant performance impact
         * @type {RouteStackGroup[]}
         * @private
         */
        this._routeStack = {
            GET: [],
            POST: [],
            PUT: [],
            DELETE: [],
            PATCH: []
        };
    }
    RouteStackCompiler.prototype.addStack = function () {
        var _this = this;
        var stackItems = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            stackItems[_i] = arguments[_i];
        }
        // Ensure stackItems is an array
        stackItems = [].concat(stackItems);
        // Adds all provided path stack to the _routeStack property
        stackItems.forEach(function (_stack) {
            var targetStack = _this._routeStack[_stack.method];
            targetStack.push(_stack);
        });
    };
    /**
     * Make as efficient as possible, this is the only function
     * that is run to map incoming requests.
     * Treat this as the most performance sensitive function of all
     */
    RouteStackCompiler.prototype.matchRequest = function (req, res) {
        /**
         * TODO(global): Do not use global namespace
         * @date - 5/26/17
         * @time - 12:14 PM
         */
        var turboMode = typeof global['TURBO_MODE'] !== 'undefined' && global['TURBO_MODE'];
        // The URL of the current request
        var incomingRequestPath = parseUrl(req).pathname;
        /**
         * TODO(production): Remove, browser testing only
         * @date - 5/27/17
         * @time - 2:56 AM
         */
        if (incomingRequestPath.includes('favicon')) {
            res.writeHead(204, { 'Content-Type': 'plain/text' });
            res.end();
            return;
        }
        var matchingRoutesStack = this._routeStack[req.method];
        // Early return if routerStack by method has no handlers
        if (!matchingRoutesStack.length) {
            earlyReturn(res);
            return;
        }
        // If TURBO_MODE is enabled, we only need to match the method as there can
        // only be a single instance for each method. Path matching is disabled
        if (turboMode) {
            var mResponse_1 = response_1.MicroResponseBuilder.create(res);
            var mRequest_1 = request_1.MicroRequestBuilder.create(req);
            // Retrieve first handler of the matching router stack
            matchingRoutesStack[0].handler(mRequest_1, mResponse_1);
            // There can only be 1 handler per method if on turboMode
            if (matchingRoutesStack.length > 1) {
                console.log('');
                console.log('\x1b[33m%s\x1b[0m', "WARNING: 'Turbo Mode' is enable but microdose detected multiple\n                handlers for " + req.method + " requests.\n");
            }
            return;
        }
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
        var mResponse = response_1.MicroResponseBuilder.create(res);
        // Create the request object only after a route match has been found
        var mRequest = request_1.MicroRequestBuilder.create(req);
        // Attach params to current request context
        if (params)
            mRequest.params = params;
        // Execute matching route handler
        routeMatch.handler(mRequest, mResponse);
    };
    return RouteStackCompiler;
}());
exports.RouteStackCompiler = RouteStackCompiler;
exports.RouteStack = new RouteStackCompiler();
//# sourceMappingURL=route_stack.js.map