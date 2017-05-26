"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var _1 = require(".");
// import * as bodyParser from 'body-parser'
var ServerApp = (function () {
    function ServerApp() {
    }
    ServerApp.prototype.helloWorld = function (req, res) {
        res.send('Hello World');
    };
    ServerApp.prototype.addHello = function (req, res) {
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
        res.send(req.params.userName + ' is forever forgotten');
    };
    return ServerApp;
}());
__decorate([
    _1.MicroMethod.Get()
], ServerApp.prototype, "helloWorld", null);
__decorate([
    _1.MicroMethod.Post() // microParser)
], ServerApp.prototype, "addHello", null);
__decorate([
    _1.MicroMethod.Put()
], ServerApp.prototype, "putToTheTest", null);
__decorate([
    _1.MicroMethod.Patch()
], ServerApp.prototype, "eyePath", null);
__decorate([
    _1.MicroMethod.Delete()
], ServerApp.prototype, "forgetMeNot", null);
ServerApp = __decorate([
    _1.MicroRouter({})
], ServerApp);
_1.MicroBootstrap(ServerApp, {
    port: 3000,
    cluster: true,
    useSocket: false,
    liteMode: true
});
//# sourceMappingURL=_example.js.map