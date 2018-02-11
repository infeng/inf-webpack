import path from 'path';
import getWebpackConfig from './getWebpackConfig';
import webpack from 'webpack';
import chalk from 'chalk';
import stripJsonComments from 'strip-json-comments';
import { readFileSync, existsSync } from 'fs';
import assert from 'assert';
import defaultBabelOptions from './defaultConfigs/babel';
import { getRcConfig } from './getConfig';

export default function build(args) {
  const cwd = args.cwd;

  const webpackrcPath = path.resolve(args.cwd, args.config || '.webpackrc');

  const webpackrc = getRcConfig(webpackrcPath);

  const webpackConfig = getWebpackConfig({
    cwd,
    ...webpackrc,
  });

  webpackConfig.plugins.push(
    new webpack.ProgressPlugin((percentage, msg, addInfo) => {
      const stream = process.stderr as any;
      if (stream.isTTY && percentage < 0.71) {
        stream.cursorTo(0);
        stream.write(`📦  ${chalk.magenta(msg)} (${chalk.magenta(addInfo)})`);
        stream.clearLine(1);
      } else if (percentage === 1) {
        console.log(chalk.green('\nwebpack: bundle build is now finished.'));
      }
    })
  );
  const compiler = webpack(webpackConfig);
  compiler.run((err, stats) => {
    if (err || stats.hasErrors()) {
      const buildInfo = stats.toString({
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
