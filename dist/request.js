"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MicroRequestBuilder = (function () {
    function MicroRequestBuilder(request) {
        this.body = {};
        this.local = {};
        this.params = {};
        this.native = request;
    }
    MicroRequestBuilder.create = function (req) {
        var _microRequest = new MicroRequestBuilder(req);
        for (var meth in _microRequest) {
            req[meth] = _microRequest[meth];
        }
        return req;
    };
    return MicroRequestBuilder;
}());
exports.MicroRequestBuilder = MicroRequestBuilder;
//# sourceMappingURL=request.js.map