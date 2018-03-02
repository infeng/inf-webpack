import deafultBrowsers from './defaultConfigs/browsers';
import deafultBabelConfig from './defaultConfigs/babel';
import autoprefixer from 'autoprefixer';
import path from 'path';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import webpack from 'webpack';
import htmlWebpackPlugin from 'html-webpack-plugin';
import WatchMissingNodeModulesPlugin from 'react-dev-utils/WatchMissingNodeModulesPlugin';

interface Option {
  entry?: string;
  cwd?: string;
  hash?: boolean;
  extraBabelPresets?: any[];
  extraBabelPlugins?: any[];
  htmlPath?: string;
  outputPath?: string;
  publicPath?: string;
  dev?: boolean;
  cssModules?: boolean;
}

export default function getWebpackConfig(opts: Option = {
  hash: true,
  dev: false,
  cssModules: true,
}) {  
  const isDev = opts.dev || process.env.NODE_ENV === 'development';

  const postcssOptions = {
    ident: 'postcss',
    plugins: () => [
      require('postcss-flexbugs-fixes'),
      autoprefixer({
        browsers: deafultBrowsers,
        flexbox: 'no-2009',
      }),
    ],
  };

  const cssModulesConfig = opts.cssModules ? {
    modules: true,
    localIdentName: '[local]___[hash:base64:5]',
  } : {};

  const cssOptions = {
    sourceMap: false,
  };

  const lessOptions = {
    sourceMap: false,
  };

  let cssRules: any[] = [
    {
      test(filePath) {
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
      exclude(filePath) {
        if (/node_modules/.test(filePath)) {
          return true;
        }
      },
      use: [
        require.resolve('style-loader'),
        {
          loader: require.resolve('css-loader'),
          options: {
            ...cssOptions,
            ...cssModulesConfig,
          },
        },
        {
          loader: require.resolve('postcss-loader'),
          options: postcssOptions,
        },
      ],
    },
    {
      test(filePath) {
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
      exclude(filePath) {
        if (/node_modules/.test(filePath)) {
          return true;
        }
      },      
      use: [
        require.resolve('style-loader'),
        {
          loader: require.resolve('css-loader'),
          options: {
            ...cssOptions,
            ...cssModulesConfig,
          },
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
    cssRules = cssRules.map(rule => {
      return {
        ...rule,
        test: rule.test,
        use: ExtractTextPlugin.extract({
          fallback: require.resolve('style-loader'),
          use: rule.use.slice(1),
        }),
      };
    });
  }

  const tsOptions = {
    transpileOnly: true,
  };

  let jsFilename = '[name].js';
  let cssFilename = '[name].css';

  if (!isDev && !opts.hash) {
    jsFilename = '[name].[chunkhash:8].js';
    cssFilename = '[name].[contenthash:8].css';
  }

  const entry = [
    opts.entry,
  ];

  const babelOptions = {
    ...deafultBabelConfig,
    presets: [
      ...deafultBabelConfig.presets,
      ...(opts.extraBabelPresets || []),
    ],
    plugins: [
      ...deafultBabelConfig.plugins,
      ...(opts.extraBabelPlugins || []),
    ],
  };

  const config = {
    entry: entry,
    devtool: isDev ? 'cheap-module-source-map' : '',
    output: {
      path: path.resolve(opts.cwd, opts.outputPath || './dist/'),
      filename: jsFilename,
      publicPath: opts.publicPath || '/',
      chunkFilename: jsFilename,
    },  
    resolve: {
      modules: ['node_modules', path.join(opts.cwd, 'node_modules')],
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: require.resolve('babel-loader'),
              options: babelOptions,
            },
          ],
        },
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: require.resolve('babel-loader'),
              options: babelOptions,
            },
            {
              loader: require.resolve('awesome-typescript-loader'),
              options: tsOptions,
            },
          ],
        },
        ...cssRules,      
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
      ]},
      plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.ModuleConcatenationPlugin(),        
        new CaseSensitivePathsPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        ...(opts.htmlPath ? [new htmlWebpackPlugin({
          inject: true,
          template: path.join(opts.cwd, opts.htmlPath),
        })] : []),        
        ...(isDev ? [
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new WatchMissingNodeModulesPlugin(path.join(opts.cwd, 'node_modules')),          
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
        }),
      ] : [
        new ExtractTextPlugin({
          filename: cssFilename,
          disable: false,
          allChunks: true,
        }),
        new webpack.optimize.UglifyJsPlugin({
          parallel: true,
          output: {
            ascii_only: true,
          },
          compress: {
            warnings: false,
          },
          sourceMap: false,
        }),
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
        }),        
      ])],
  };

  return config;
}
