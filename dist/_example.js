"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var _1 = require(".");
var bodyParser = require("body-parser");
var sampleMiddleware = function (req, res, next) {
    console.log('Test middleware message');
    req.local.user = { name: 'some_user' };
    next(req);
};
var ChildRouter = (function () {
    function ChildRouter() {
    }
    ChildRouter.prototype.party = function (req, res) {
        res.send(req.local.user);
    };
    ChildRouter.prototype.someone = function (req, res) {
        res.send('someone');
    };
    return ChildRouter;
}());
__decorate([
    _1.MicroMethod.Get()
], ChildRouter.prototype, "party", null);
__decorate([
    _1.MicroMethod.Get('/someone')
], ChildRouter.prototype, "someone", null);
ChildRouter = __decorate([
    _1.MicroRouter({
        middleware: [sampleMiddleware]
    })
], ChildRouter);
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
    _1.MicroMethod.Delete('/:userName')
], ServerApp.prototype, "forgetMeNot", null);
ServerApp = __decorate([
    _1.MicroRouter({
        middleware: [bodyParser.json()],
        children: [{ prefix: '/party', router: ChildRouter }]
    })
], ServerApp);
_1.MicroBootstrap(ServerApp, {
    port: 3000,
    cluster: false,
    useSocket: false,
});
//# sourceMappingURL=_example.js.map