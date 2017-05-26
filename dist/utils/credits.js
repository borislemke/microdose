"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var packageJson = require('../../package.json');
exports.microCredits = function (port) {
    if (port === void 0) { port = null; }
    var credits = fs.readFileSync(path.resolve(__dirname, '../..', 'credits.txt'), 'utf8')
        .split('\n')
        .forEach(function (_line) {
        console.log('\x1b[34m%s\x1b[0m', _line.replace(/\[VERSION]/g, packageJson.version));
    });
    console.log('');
    if (port)
        console.log('\x1b[33m%s\x1b[0m', '       microdose is listening on port ' + port);
};
//# sourceMappingURL=credits.js.map