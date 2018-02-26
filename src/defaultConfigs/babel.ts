import defaultBrowsers from './browsers';

export default {
  cacheDirectory: false,
  presets: [
    [require.resolve("@babel/preset-env"), {
      targets: {
        "browsers": defaultBrowsers,
      },
      modules: false,
    }],
    require.resolve("@babel/preset-react")
  ],
  plugins: [
    require.resolve('babel-plugin-react-require'),
    require.resolve('@babel/plugin-syntax-dynamic-import'),
    require.resolve('@babel/plugin-transform-runtime'),
    require.resolve('@babel/plugin-proposal-export-default'),
  ],
};