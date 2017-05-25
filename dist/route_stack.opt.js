var RouteStackCompiler;
(function () {
    "use strict";

    var _$0 = this;

    function _0() {
        /**
         * All path stack collected from the MicroMethod decorator will
         * end up here to be path-matched for each incoming request
         * @type {RouteStackGroup[]}
         * @private
         */this._routeStack = {
            GET: [],
            POST: [],
            PUT: [],
            DELETE: [],
            PATCH: []
        };
    }

    var _1 = _0.prototype;

    function _2() {
        var _this = this;

        var stackItems = [];

        for (var _i = 0; _i < arguments.length; _i++) {
            stackItems[_i] = arguments[_i];
        } // Ensure stackItems is an array


        stackItems = [].concat(stackItems); // Adds all provided path stack to the _routeStack property

        stackItems.forEach(function (_stack) {
            var targetStack = _this._routeStack[_stack.method];
            targetStack.push(_stack);
        });
    }

    function _3(req, res) {
        var incomingRequestRoute = parseUrl(req).pathname;
        var matchingRoutesStack = this._routeStack[req.method]; // Found a matching routerName stack

        var routeMatch; // Found parameters inside path path

        var params = {};

        for (var i = 0; i < matchingRoutesStack.length; i++) {
            // The currently iterated routerName stack
            var curr = matchingRoutesStack[i]; // Break loop if exact root match found

            if (curr.path === incomingRequestRoute) {
                routeMatch = curr;
                break;
            } // Checks if the currently iterated routeStack has a parameter identifier.
            // If it does not, immediately continue loop. Regex checking function below
            // this point is expensive, we want to prevent from doing it if not necessary.
            // e.g @MicroMethod.Post('/users/:userId') or ('/foo*')


            if (!/\/?:(.*)|\*/g.test(curr.path)) continue; // MicroRequest should bind params data to the request
            // e.g req.params.userId = `value of :userId`
            /** TODO(perf): offload path matching to C module */
            var reg = pathToRegexp(curr.path);
            var regExec = reg.exec(incomingRequestRoute);
            if (!regExec) continue;

            for (var i_1 = 0; i_1 < reg.keys.length; i_1++) {
                var matchValue = regExec[i_1 + 1];
                var matchKey = reg.keys[i_1].name;
                params[matchKey] = matchValue;
            }

            if (_$0.Object.keys(params).length) {
                routeMatch = curr;
                break;
            }
        }

        var mResponse = response_1.MicroResponseBuilder.create(res);

        if (!routeMatch) {
            // No matching path handler found
            // Return 404
            mResponse.status(status_codes_1.HTTPStatusCodes.NOT_FOUND).send('Not Found');
            return;
        }

        var mRequest = request_1.MicroRequestBuilder.create(req); // Attach params to current request context

        if (params) mRequest.params = params;
        routeMatch.handler(mRequest, mResponse);
    }

    RouteStackCompiler = undefined;
    _1.matchRequest = _3;
    _1.addStack = _2;
    RouteStackCompiler = _0;
}).call(this);