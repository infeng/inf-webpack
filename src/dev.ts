import webpack from 'webpack';
import webpackDevServer from 'webpack-dev-server';
import { getRcConfig } from './getConfig';
import getWebpackConfig from './getWebpackConfig';
import path from 'path';
import openBrowser from 'react-dev-utils/openBrowser';
import { choosePort, prepareUrls } from 'react-dev-utils/WebpackDevServerUtils';

export default function dev(args) {
  const cwd = args.cwd;

  const webpackrcPath = path.resolve(args.cwd, args.config || '.webpackrc');

  const webpackrc = getRcConfig(webpackrcPath);

  const webpackConfig = getWebpackConfig({
    cwd,
    ...webpackrc,
  });

  const port = webpackrc.port || 8000;

  const host = webpackrc.host || '0.0.0.0';

  const serverConfig = {
    inline: true,
    hot: true,
    contentBase: webpackConfig.output.path,
    watchContentBase: true,
    watchOptions: {
      ignored: /node_modules/
    },
    quiet: true,
  };

  choosePort(host, port).then(port => {
    if (port === null) return;
    const compiler = webpack(webpackConfig);
    const urls = prepareUrls('http', host, port);
    const server = new webpackDevServer(compiler, serverConfig);

    server.listen(port, host, err => {
      if (err) return console.error(err);
      console.info(`开发服务访问地址为:${urls.localUrlForBrowser}`);
      openBrowser(urls.localUrlForBrowser);
    });
  });
}
