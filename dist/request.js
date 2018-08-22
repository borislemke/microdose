"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * We might not even need to have the request extended
 * we could theoretically leave it to middleware functions
 */
var uRequestBuilder = /** @class */ (function () {
    function uRequestBuilder(request) {
        /**
         * Injected object from a request payload
         * e.g @MicroMethod.Post('/users') -> POST http://hostname/users {"user_name": "user", "password": "1234"}
         * body = {
         *      user_name: "user",
         *      password: "1234",
         * }
         * @type {{}}
         */
        this.body = {};
        /**
         * Request scoped Object
         * can be used to store and retrieve values on a per request basis
         * @type {{}}
         */
        this.local = {};
        /**
         * Params injected from matching URL patterns
         * e.g @MicroMethod.Get('/users/:userId') -> GET http://hostname/users/johnny
         * params = {
         *      userId: johnny // From the URL
         * }
         * @type {{}}
         */
        this.params = {};
        this.nativeRequest = request;
    }
    uRequestBuilder.create = function (req) {
        var _microRequest = new uRequestBuilder(req);
        // Merges properties of IncomingMessage with MicroRequest
        // Based on benchmarks of a couple methods to do this,
        // this is the most performant of all
        for (var method in _microRequest) {
            req[method] = _microRequest[method];
        }
        return req;
    };
    /**
     * Is this necessary?
     * @param key
     * @returns {string|null}
     */
    uRequestBuilder.prototype.get = function (key) {
        // Look up for a matching key value in the headers first
        // before looking up inside the request scoped `local` Object
        return this.nativeRequest.headers[key] || this.local[key] || null;
    };
    return uRequestBuilder;
}());
exports.uRequestBuilder = uRequestBuilder;
//# sourceMappingURL=request.js.map