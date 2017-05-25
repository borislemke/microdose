"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MicroResponseBuilder = (function () {
    function MicroResponseBuilder(_res) {
        /**
         * Default response status code
         * @type {number}
         * @private
         */
        this._statusCode = 200;
        /**
         * Default Content-Type header
         * @type {ResponseHeaders}
         * @private
         */
        this._responseHeaders = {
            'Content-Type': 'text/plain; charset=utf-8'
        };
        this.native = _res;
    }
    MicroResponseBuilder.create = function (res) {
        var microResponse = new MicroResponseBuilder(res);
        /**
         * Merge ServerResponse with original MicroResponse
         */
        for (var meth in microResponse) {
            res[meth] = microResponse[meth];
        }
        return res;
    };
    MicroResponseBuilder.prototype.set = function (key, value) {
        this.native.setHeader(key, value);
    };
    /**
     * Sets the status code of the current response Object
     * @param statusCode
     * @returns {MicroResponse}
     */
    MicroResponseBuilder.prototype.status = function (statusCode) {
        this._statusCode = statusCode;
        // Force type assertion as TS does not understand that the Object is dynamically merged
        return this;
    };
    MicroResponseBuilder.prototype.send = function (payload) {
        var payloadType = typeof payload;
        if (payloadType === 'object') {
            payload = JSON.stringify(payload);
        }
        payload = payload && Buffer.from(payload);
        payload || (payload = 'undefined');
        this.native.setHeader('Content-Length', payload.length);
        /**
         * TODO(experimental): Optimize
         * @date - 5/25/17
         * @time - 2:32 AM
         */
        if (!global['USE_SOCKET']) {
            this.native.writeHead(this._statusCode, this._responseHeaders);
        }
        this.native.end(payload);
    };
    return MicroResponseBuilder;
}());
exports.MicroResponseBuilder = MicroResponseBuilder;
//# sourceMappingURL=response.js.map