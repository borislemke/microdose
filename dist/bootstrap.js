"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var os = require("os");
var uws = require("uws");
var http = require("http");
var cluster = require("cluster");
var route_stack_1 = require("./route_stack");
var credits_1 = require("./utils/credits");
var router_1 = require("./router");
var numCPUs = os.cpus().length;
function startCluster(bootStrap) {
    if (cluster.isMaster) {
        console.log("Master " + process.pid + " is running");
        for (var i = 0; i < numCPUs; i++) {
            cluster.fork();
        }
        cluster.on('exit', function (worker, code, signal) {
            console.log("worker " + worker.process.pid + " died");
        });
    }
    if (cluster.isWorker) {
        console.log("Worker " + process.pid + " started");
        bootStrap();
    }
}
exports.MicroBootstrap = function (serverApp, config) {
    var port;
    var clusterize = false;
    if (typeof config === 'object') {
        port = config.port;
        clusterize = config.cluster;
    }
    if (typeof config === 'number') {
        port = config;
    }
    if (typeof config === 'undefined') {
        port = 3000;
    }
    port || (port = 3000);
    var bootStrap = function () {
        var topRoutes = router_1.PartyRouterStack.find(function (_stack) { return _stack.routerName === serverApp.name; });
        if (!topRoutes) {
            console.warn('No root routerStack found. If you intended not to add any routerStack to the main Party, ignore this message.');
        }
        else {
            route_stack_1.RouteStack.addStack.apply(route_stack_1.RouteStack, topRoutes.routerStack);
        }
        var useSocket = config && config.useSocket;
        var server;
        /** TODO(opt): Optimize statement */
        if (useSocket) {
            Object.defineProperty(global, 'USE_SOCKET', {
                get: function () { return true; }
            });
            console.log('');
            console.log('\x1b[33m%s\x1b[0m', '    WARNING: BootstrapConfig.useSocket is a highly experimental feature. Do not rely on it in production.');
            console.log('');
            server = uws.http.createServer(function (req, res) {
                route_stack_1.RouteStack.matchRequest(req, res);
            });
        }
        else {
            /**
             * TODO(opt):
             */
            Object.defineProperty(global, 'USE_SOCKET', {
                get: function () { return false; }
            });
            server = http.createServer(function (req, res) { return route_stack_1.RouteStack.matchRequest(req, res); });
        }
        server.listen(port, function () {
            credits_1.microCredits(port);
        });
    };
    if (clusterize) {
        startCluster(bootStrap);
    }
    else {
        bootStrap();
    }
};
//# sourceMappingURL=bootstrap.js.map