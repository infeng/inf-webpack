"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var getWebpackConfig_1 = __importDefault(require("./getWebpackConfig"));
var webpack_1 = __importDefault(require("webpack"));
var chalk_1 = __importDefault(require("chalk"));
var getConfig_1 = require("./getConfig");
function build(args) {
    var cwd = args.cwd;
    var webpackrcPath = path_1.default.resolve(args.cwd, args.config || '.webpackrc');
    var webpackrc = getConfig_1.getRcConfig(webpackrcPath);
    var webpackConfig = getWebpackConfig_1.default(__assign({ cwd: cwd }, webpackrc));
    webpackConfig.plugins.push(new webpack_1.default.ProgressPlugin(function (percentage, msg, addInfo) {
        var stream = process.stderr;
        if (stream.isTTY && percentage < 0.71) {
            stream.cursorTo(0);
            stream.write("\uD83D\uDCE6  " + chalk_1.default.magenta(msg) + " (" + chalk_1.default.magenta(addInfo) + ")");
            stream.clearLine(1);
        }
        else if (percentage === 1) {
            console.log(chalk_1.default.green('\nwebpack: bundle build is now finished.'));
        }
    }));
    var compiler = webpack_1.default(webpackConfig);
    compiler.run(function (err, stats) {
        if (err || stats.hasErrors()) {
            var buildInfo = stats.toString({
                colors: true,
                children: true,
            });
            console.log(stats.toString(buildInfo));
            return;
        }
        console.log(stats.toString({
            colors: true,
            children: false,
            modules: false,
        }));
    });
}
exports.default = build;
