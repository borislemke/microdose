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
        this.nativeResponse = _res;
    }
    MicroResponseBuilder.create = function (res) {
        // Extended response object
        var microResponse = new MicroResponseBuilder(res);
        // Merge properties of ServerResponse with MicroResponse
        for (var method in microResponse) {
            res[method] = microResponse[method];
        }
        return res;
    };
    /**
     * Set header values for the response to be sent. This is just
     * @param key
     * @param value
     */
    MicroResponseBuilder.prototype.set = function (key, value) {
        this.nativeResponse.setHeader(key, value);
    };
    /**
     * Sets the status code of the current response Object
     * @param statusCode
     * @returns {MicroResponse}
     */
    MicroResponseBuilder.prototype.status = function (statusCode) {
        // Sets the status code of the next response
        this._statusCode = statusCode;
        // Force type assertion as TS does not understand
        // that the Object has been dynamically merged
        return this;
    };
    MicroResponseBuilder.prototype.send = function (payload) {
        // Determine what the final payload should be
        // by analyzing it's type
        var payloadType = typeof payload;
        // Convert payload to string if type is of Object
        if (payloadType === 'object') {
            payload = JSON.stringify(payload);
        }
        // Provide fallback content
        payload = payload || '';
        // Provide Content-Length header value
        this.nativeResponse.setHeader('Content-Length', payload.length);
        // Write response headers to be sent
        this.nativeResponse.writeHead(this._statusCode, this._responseHeaders);
        // End connection and send off payload
        this.nativeResponse.end(Buffer.from(payload));
    };
    return MicroResponseBuilder;
}());
exports.MicroResponseBuilder = MicroResponseBuilder;
//# sourceMappingURL=response.js.map