"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var status_codes_1 = require("./status_codes");
var uResponseBuilder = /** @class */ (function () {
    function uResponseBuilder(_res) {
        /**
         * Default response status code.
         * @type {number}
         * @private
         */
        this.statusCode = 200;
        this.nativeResponse = _res;
    }
    uResponseBuilder.create = function (res) {
        // Extended response object.
        var microResponse = new uResponseBuilder(res);
        // Merge properties of ServerResponse with uResponse.
        for (var method in microResponse) {
            res[method] = microResponse[method];
        }
        return res;
    };
    /**
     * Set header values for the response to be sent. This is just...
     * @param key
     * @param value
     */
    uResponseBuilder.prototype.set = function (key, value) {
        this.nativeResponse.setHeader(key, value);
    };
    /**
     * Sends an empty response with the response code only as the header.
     * @param statusCode
     */
    uResponseBuilder.prototype.sendStatus = function (statusCode) {
        this.nativeResponse.writeHead(statusCode, uResponseBuilder.defaultResponseHeaders);
        var statusText = statusCode + ': UNKNOWN STATUS CODE';
        for (var text in status_codes_1.HTTPStatusCodes) {
            if (status_codes_1.HTTPStatusCodes[text] === statusCode) {
                statusText = statusCode + ": " + text;
            }
        }
        this.nativeResponse.write(statusText);
        this.nativeResponse.end();
    };
    /**
     * Sets the status code of the current response Object.
     * @param statusCode
     * @returns {uResponse}
     */
    uResponseBuilder.prototype.status = function (statusCode) {
        // Sets the status code of the next response.
        this.statusCode = statusCode;
        // Force type assertion as TS does not understand that the Object
        // has been dynamically merged.
        return this;
    };
    uResponseBuilder.prototype.send = function (payload) {
        // Determine what the final payload should be by analyzing it's
        // type.
        var payloadType = typeof payload;
        // Convert payload to string if type is of Object.
        if (payloadType === 'object') {
            payload = JSON.stringify(payload);
        }
        // Provide fallback content.
        payload = payload || '';
        var contentLength = payload.length;
        this.nativeResponse.writeHead(this.statusCode, __assign({}, uResponseBuilder.defaultResponseHeaders, { 
            // Provide Content-Length header value.
            'Content-Length': contentLength }));
        // End connection and send off payload.
        this.nativeResponse.end(Buffer.from(payload));
    };
    /**
     * Default Content-Type header.
     * @type {ResponseHeaders}
     */
    uResponseBuilder.defaultResponseHeaders = {
        'Content-Type': 'text/plain; charset=utf-8'
    };
    return uResponseBuilder;
}());
exports.uResponseBuilder = uResponseBuilder;
//# sourceMappingURL=response.js.map