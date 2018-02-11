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
var browsers_1 = __importDefault(require("./defaultConfigs/browsers"));
var babel_1 = __importDefault(require("./defaultConfigs/babel"));
var autoprefixer_1 = __importDefault(require("autoprefixer"));
var path_1 = __importDefault(require("path"));
var extract_text_webpack_plugin_1 = __importDefault(require("extract-text-webpack-plugin"));
var case_sensitive_paths_webpack_plugin_1 = __importDefault(require("case-sensitive-paths-webpack-plugin"));
var webpack_1 = __importDefault(require("webpack"));
var html_webpack_plugin_1 = __importDefault(require("html-webpack-plugin"));
function getWebpackConfig(opts) {
    var isDev = process.env.NODE_ENV === 'development';
    var postcssOptions = {
        ident: 'postcss',
        plugins: function () { return [
            require('postcss-flexbugs-fixes'),
            autoprefixer_1.default({
                browsers: browsers_1.default,
                flexbox: 'no-2009',
            }),
        ]; },
    };
    var cssModulesConfig = {
        modules: true,
        localIdentName: '[local]___[hash:base64:5]',
    };
    var cssOptions = {
        sourceMap: false,
    };
    var lessOptions = {
        sourceMap: false,
    };
    var cssRules = [
        {
            test: function (filePath) {
                return /\.css$/.test(filePath) && /node_modules/.test(filePath);
            },
            use: [
                require.resolve('style-loader'),
                {
                    loader: require.resolve('css-loader'),
                    options: cssOptions,
                },
                {
                    loader: require.resolve('postcss-loader'),
                    options: postcssOptions,
                },
            ],
        },
        {
            test: /\.css$/,
            exclude: function (filePath) {
                if (/node_modules/.test(filePath)) {
                    return true;
                }
            },
            use: [
                require.resolve('style-loader'),
                {
                    loader: require.resolve('css-loader'),
                    options: __assign({}, cssOptions, cssModulesConfig),
                },
                {
                    loader: require.resolve('postcss-loader'),
                    options: postcssOptions,
                },
            ],
        },
        {
            test: function (filePath) {
                return /\.less$/.test(filePath) && /node_modules/.test(filePath);
            },
            use: [
                require.resolve('style-loader'),
                {
                    loader: require.resolve('css-loader'),
                    options: cssOptions,
                },
                {
                    loader: require.resolve('postcss-loader'),
                    options: postcssOptions,
                },
                {
                    loader: require.resolve('less-loader'),
                    options: lessOptions,
                },
            ],
        },
        {
            test: /\.less$/,
            exclude: function (filePath) {
                if (/node_modules/.test(filePath)) {
                    return true;
                }
            },
            use: [
                require.resolve('style-loader'),
                {
                    loader: require.resolve('css-loader'),
                    options: __assign({}, cssOptions, cssModulesConfig),
                },
                {
                    loader: require.resolve('postcss-loader'),
                    options: postcssOptions,
                },
                {
                    loader: require.resolve('less-loader'),
                    options: lessOptions,
                },
            ],
        },
    ];
    if (!isDev) {
        cssRules = cssRules.map(function (rule) {
            return {
                test: rule.test,
                use: extract_text_webpack_plugin_1.default.extract({
                    fallback: 'style-loader',
                    use: rule.use.slice(1),
                }),
            };
        });
    }
    var tsOptions = {
        transpileOnly: true,
    };
    var jsFilename = '[name].js';
    var cssFilename = '[name].css';
    if (!isDev && !opts.hash) {
        jsFilename = '[name].[chunkhash:8].js';
        cssFilename = '[name].[contenthash:8].css';
    }
    var entry = [
        opts.entry,
    ];
    if (isDev) {
        entry.unshift(require.resolve('react-dev-utils/webpackHotDevClient'));
    }
    var config = {
        entry: entry,
        devtool: isDev ? 'eval-source-map' : '',
        output: {
            path: path_1.default.resolve(opts.cwd, opts.outputPath || './dist/'),
            filename: jsFilename,
            publicPath: opts.publicPath || '/',
            chunkFilename: jsFilename,
        },
        resolve: {
            modules: ['node_modules', path_1.default.join(opts.cwd, 'node_modules')],
            extensions: ['.ts', 'tsx', '.js', '.jsx', '.json'],
        },
        module: {
            rules: [
                {
                    test: /\.jsx?$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: require.resolve('babel-loader'),
                            options: __assign({}, babel_1.default, { presets: babel_1.default.presets.concat((opts.extraBabelPresets || [])), plugins: babel_1.default.plugins.concat((opts.extraBabelPlugins || [])) }),
                        },
                    ],
                },
                {
                    test: /\.tsx?$/,
                    use: [
                        {
                            loader: require.resolve('babel-loader'),
                            options: babel_1.default,
                        },
                        {
                            loader: require.resolve('ts-loader'),
                            options: tsOptions,
                        },
                    ],
                }
            ].concat(cssRules, [
                {
                    test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
                    use: [
                        {
                            loader: require.resolve('url-loader'),
                            options: {
                                limit: 10000,
                                minetype: 'application/font-woff',
                            },
                        },
                    ],
                },
                {
                    test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                    use: [
                        {
                            loader: require.resolve('url-loader'),
                            options: {
                                limit: 10000,
                                minetype: 'application/octet-stream',
                            },
                        },
                    ],
                },
                {
                    test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
                    use: [
                        {
                            loader: require.resolve('url-loader'),
                            options: {
                                limit: 10000,
                                minetype: 'application/vnd.ms-fontobject',
                            },
                        },
                    ],
                },
                {
                    test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                    use: [
                        {
                            loader: require.resolve('url-loader'),
                            options: {
                                limit: 10000,
                                minetype: 'image/svg+xml',
                            },
                        },
                    ],
                },
                {
                    test: /\.(png|jpg|jpeg|gif)(\?v=\d+\.\d+\.\d+)?$/i,
                    use: [
                        {
                            loader: require.resolve('url-loader'),
                            options: {
                                limit: 10000,
                            },
                        },
                    ],
                },
            ])
        },
        plugins: [
            new case_sensitive_paths_webpack_plugin_1.default(),
            new webpack_1.default.NoEmitOnErrorsPlugin(),
            new html_webpack_plugin_1.default({
                inject: true,
                template: path_1.default.join(opts.cwd, opts.htmlPath),
            })
        ].concat((isDev ? [
            new webpack_1.default.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
            }),
        ] : [
            new extract_text_webpack_plugin_1.default({
                filename: cssFilename,
                disable: false,
                allChunks: true,
            }),
            new webpack_1.default.optimize.UglifyJsPlugin({
                parallel: true,
                output: {
                    ascii_only: true,
                },
                compress: {
                    warnings: false,
                },
                sourceMap: false,
            }),
            new webpack_1.default.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
            }),
        ])),
    };
    return config;
}
exports.default = getWebpackConfig;
