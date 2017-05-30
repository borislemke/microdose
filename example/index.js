"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var dist_1 = require("../dist");
var ServerApp = (function () {
    function ServerApp() {
    }
    ServerApp.prototype.helloWorld = function (req, res) {
        res.send('Hello World');
    };
    ServerApp.prototype.addHello = function (req, res) {
        console.log('req.headers', req.headers);
        res.send(req.body);
    };
    ServerApp.prototype.putToTheTest = function (req, res) {
        console.log('put');
        res.send(req.body.putty);
    };
    ServerApp.prototype.eyePath = function (req, res) {
        console.log('patch');
        res.send(req.body.patch_name);
    };
    ServerApp.prototype.forgetMeNot = function (req, res) {
        res.send('Deleted!');
    };
    return ServerApp;
}());
__decorate([
    dist_1.MicroMethod.Get('/users')
], ServerApp.prototype, "helloWorld", null);
__decorate([
    dist_1.MicroMethod.Post()
], ServerApp.prototype, "addHello", null);
__decorate([
    dist_1.MicroMethod.Put()
], ServerApp.prototype, "putToTheTest", null);
__decorate([
    dist_1.MicroMethod.Patch()
], ServerApp.prototype, "eyePath", null);
__decorate([
    dist_1.MicroMethod.Delete()
], ServerApp.prototype, "forgetMeNot", null);
ServerApp = __decorate([
    dist_1.MicroRouter()
], ServerApp);
dist_1.MicroBootstrap(ServerApp, 3000, function () {
    console.log('listening');
});
//# sourceMappingURL=index.js.map