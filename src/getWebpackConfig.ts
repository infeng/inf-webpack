import deafultBrowsers from './defaultConfigs/browsers';
import deafultBabelConfig from './defaultConfigs/babel';
import autoprefixer from 'autoprefixer';
import path from 'path';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import webpack from 'webpack';
import htmlWebpackPlugin from 'html-webpack-plugin';

interface Option {
  entry?: string;
  cwd?: string;
  hash?: boolean;
  extraBabelPresets?: any[];
  extraBabelPlugins?: any[];
  htmlPath?: string;
  outputPath?: string;
  publicPath?: string;
}

export default function getWebpackConfig(opts: Option) {  
  const isDev = process.env.NODE_ENV === 'development';

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

  const cssModulesConfig = {
    modules: true,
    localIdentName: '[local]___[hash:base64:5]',
  };

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
        test: rule.test,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
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

  if (isDev) {
    entry.unshift(
      require.resolve('react-dev-utils/webpackHotDevClient'),
    );
  }

  const config = {
    entry: entry,
    devtool: isDev ? 'eval-source-map' : '',
    output: {
      path: path.resolve(opts.cwd, opts.outputPath || './dist/'),
      filename: jsFilename,
      publicPath: opts.publicPath || '/',
      chunkFilename: jsFilename,
    },
    resolve: {
      modules: ['node_modules', path.join(opts.cwd, 'node_modules')],
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
              options: {
                ...deafultBabelConfig,
                presets: [
                  ...deafultBabelConfig.presets,
                  ...(opts.extraBabelPresets || []),
                ],
                plugins: [
                  ...deafultBabelConfig.plugins,
                  ...(opts.extraBabelPlugins || []),
                ],
              },
            },
          ],
        },
        {
          test: /\.tsx?$/,
          use: [
            {
              loader: require.resolve('babel-loader'),
              options: deafultBabelConfig,
            },
            {
              loader: require.resolve('ts-loader'),
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
        new CaseSensitivePathsPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new htmlWebpackPlugin({
          inject: true,
          template: path.join(opts.cwd, opts.htmlPath),
        }),        
        ...(isDev ? [
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
