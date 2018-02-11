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
var webpack_1 = __importDefault(require("webpack"));
var webpack_dev_server_1 = __importDefault(require("webpack-dev-server"));
var getConfig_1 = require("./getConfig");
var getWebpackConfig_1 = __importDefault(require("./getWebpackConfig"));
var path_1 = __importDefault(require("path"));
var openBrowser_1 = __importDefault(require("react-dev-utils/openBrowser"));
var WebpackDevServerUtils_1 = require("react-dev-utils/WebpackDevServerUtils");
function dev(args) {
    var cwd = args.cwd;
    var webpackrcPath = path_1.default.resolve(args.cwd, args.config || '.webpackrc');
    var webpackrc = getConfig_1.getRcConfig(webpackrcPath);
    var webpackConfig = getWebpackConfig_1.default(__assign({ cwd: cwd }, webpackrc));
    var port = webpackrc.port || 8000;
    var host = webpackrc.host || '0.0.0.0';
    var serverConfig = {
        inline: true,
        hot: true,
        contentBase: webpackConfig.output.path,
        watchContentBase: true,
        watchOptions: {
            ignored: /node_modules/
        },
        quiet: true,
    };
    WebpackDevServerUtils_1.choosePort(host, port).then(function (port) {
        if (port === null)
            return;
        var compiler = webpack_1.default(webpackConfig);
        var urls = WebpackDevServerUtils_1.prepareUrls('http', host, port);
        var server = new webpack_dev_server_1.default(compiler, serverConfig);
        server.listen(port, host, function (err) {
            if (err)
                return console.error(err);
            console.info("\u5F00\u53D1\u670D\u52A1\u8BBF\u95EE\u5730\u5740\u4E3A:" + urls.localUrlForBrowser);
            openBrowser_1.default(urls.localUrlForBrowser);
        });
    });
}
exports.default = dev;
