import webpack from 'webpack';
import webpackDevServer from 'webpack-dev-server';
import { getRcConfig } from './getConfig';
import getWebpackConfig from './getWebpackConfig';
import path from 'path';
import openBrowser from 'react-dev-utils/openBrowser';
import { choosePort, prepareUrls } from 'react-dev-utils/WebpackDevServerUtils';
import { createCompiler } from 'react-dev-utils/WebpackDevServerUtils';
import fs from 'fs';
import errorOverlayMiddleware from 'react-dev-utils/errorOverlayMiddleware';
import noopServiceWorkerMiddleware from 'react-dev-utils/noopServiceWorkerMiddleware';

export default function dev(args) {
  const cwd = args.cwd;

  const webpackrcPath = path.resolve(args.cwd, args.config || '.webpackrc');

  const webpackrc = getRcConfig(webpackrcPath);

  const webpackConfig = getWebpackConfig({
    cwd,
    dev: true,
    ...webpackrc,
  });

  webpackConfig.entry = [
    require.resolve('react-dev-utils/webpackHotDevClient'),
    ...webpackConfig.entry,
  ];

  const port = webpackrc.port || 8000;

  const host = webpackrc.host || '0.0.0.0';

  const serverConfig = {
    hot: true,
    contentBase: webpackConfig.output.path,
    watchContentBase: true,
    publicPath: webpackConfig.output.publicPath,
    watchOptions: {
      ignored: /node_modules/
    },
    historyApiFallback: {
      // Paths with dots should still use the history fallback.
      // See https://github.com/facebookincubator/create-react-app/issues/387.
      disableDotRule: true,
    },
    quiet: true,
    port: port,
    host: host,
    clientLogLevel: 'none',
    compress: true,    
    before(app) {
      // This lets us open files from the runtime error overlay.
      app.use(errorOverlayMiddleware());
      // This service worker file is effectively a 'no-op' that will reset any
      // previous service worker registered for the same host:port combination.
      // We do this in development to avoid hitting the production cache if
      // it used the same host and port.
      // https://github.com/facebookincubator/create-react-app/issues/2272#issuecomment-302832432
      app.use(noopServiceWorkerMiddleware());
    },
  };

  choosePort(host, port).then(port => {
    if (port === null) return;
    const urls = prepareUrls('http', host, port,);
    const useYarn = fs.existsSync(path.join(cwd, '.yarnLockFile'));
    const appName = require(path.join(cwd, 'package.json')).name;
    const compiler = createCompiler(webpack, webpackConfig, appName, urls, useYarn);
    const server = new webpackDevServer(compiler, serverConfig);

    server.listen(port, host, err => {
      if (err) return console.error(err);
      console.info(`开发服务访问地址为:${urls.localUrlForBrowser}`);
      openBrowser(urls.localUrlForBrowser);
    });
  });
}
