"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * We might not even need to have the request extended
 * we could theoretically leave it to middleware functions
 */
var MicroRequestBuilder = (function () {
    function MicroRequestBuilder(request) {
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
        this.native = request;
    }
    MicroRequestBuilder.create = function (req) {
        var _microRequest = new MicroRequestBuilder(req);
        /**
         * OPT1
         * Merges properties of IncomingMessage with MicroRequest
         */
        for (var meth in _microRequest) {
            /**
             * TODO(opt): Benchmark these
             * @date - 5/26/17
             * @time - 2:09 PM
             */
            req[meth] = _microRequest[meth];
        }
        /* OPT2
         req = {
         ...toJSON(req),
         ...toJSON(_microRequest)
         } as MicroRequest
         */
        /* OPT3
         * req = Object.assign({}, toJSON(req), toJSON(_microRequest))
         */
        return req;
    };
    /**
     * Is this necessary?
     * @param key
     * @returns {string|null}
     */
    MicroRequestBuilder.prototype.get = function (key) {
        // Look up for a matching key value in the headers first
        // before looking up inside the request scoped `local` Object
        return this.native.headers(key) || this.local[key] || null;
    };
    return MicroRequestBuilder;
}());
exports.MicroRequestBuilder = MicroRequestBuilder;
//# sourceMappingURL=request.js.map