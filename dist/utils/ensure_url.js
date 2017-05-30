"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureURIValid = function () {
    var routes = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        routes[_i] = arguments[_i];
    }
    var route = routes.join('/');
    // Remove leading and trailing slashes
    route = route.replace(/^\/+|\/+$/g, '');
    // Replace multiple slashes with a single slash
    route = route.replace(/\/+/g, '/');
    // Prepend path with leading slash
    return '/' + route;
};
//# sourceMappingURL=ensure_url.js.map