"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var src_1 = require("../dist");
var App = /** @class */ (function () {
    function App() {
    }
    App.prototype.helloWorld = function (req, res) {
        res.send('Hello world!');
    };
    __decorate([
        src_1.uMethods.get()
    ], App.prototype, "helloWorld", null);
    App = __decorate([
        src_1.uRouter()
    ], App);
    return App;
}());
var config = {
    port: 3000,
    turboMode: !!process.env.TURBO
};
src_1.uApp.bootstrap(App, config)
    .then(function () { return console.log('\nListening on port:', config.port); });
