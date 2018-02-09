"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var getWebpackConfig_1 = __importDefault(require("./getWebpackConfig"));
var webpack_1 = __importDefault(require("webpack"));
var chalk_1 = __importDefault(require("chalk"));
var strip_json_comments_1 = __importDefault(require("strip-json-comments"));
var fs_1 = require("fs");
var assert_1 = __importDefault(require("assert"));
function getRcConfig(rcFile) {
    return JSON.parse(strip_json_comments_1.default(fs_1.readFileSync(rcFile, 'utf-8')));
}
function build(args) {
    var cwd = args.cwd;
    var webpackrcPath = path_1.default.resolve(args.cwd, args.config || '.webpackrc');
    assert_1.default(fs_1.existsSync(webpackrcPath), "can not find " + webpackrcPath);
    var webpackrc = getRcConfig(webpackrcPath);
    var webpackConfig = getWebpackConfig_1.default({
        cwd: cwd,
        entry: webpackrc.entry,
        extraBabelPresets: webpackrc.extraBabelPresets,
        extraBabelPlugins: webpackrc.extraBabelPlugins,
    });
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
