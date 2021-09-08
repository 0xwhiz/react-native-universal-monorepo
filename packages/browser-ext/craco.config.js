const path = require("path");
const { getLoader, loaderByName, whenDev } = require("@craco/craco");
const webpack = require("webpack");
const { getWebpackNohoistAlias } = require("@rnup/build-tools/src");

const externalPackages = [path.join(__dirname, "../core")]

module.exports = {
  webpack: {
    alias: getWebpackNohoistAlias(__dirname),
    plugins: [
      // Inject the "__DEV__" global variable.
      new webpack.DefinePlugin({
        __DEV__: process.env.NODE_ENV !== "production",
      }),
      // Inject the "__SUB_PLATFORM__" global variable. 
      // It can be used to determine whether we're running withing a 
      // browser extension or not.
      new webpack.DefinePlugin({
        __SUB_PLATFORM__: JSON.stringify("broswer-ext"),
      }),
    ],
    configure: (webpackConfig, { env, paths }) => {
      // By default, Create React App doesn't allow pasrsing dependencies 
      // that live outside of the project root directory. 
      // Here we patch Create React App's babel-loader settings to allow
      // loading external packages.
      const { isFound, match } = getLoader(
        webpackConfig,
        loaderByName("babel-loader")
      );
      if (isFound) {
        const include = Array.isArray(match.loader.include)
          ? match.loader.include
          : [match.loader.include];
        for (const externalPackage in externalPackages) {
          match.loader.include = include.concat[externalPackages];
        }
      }
      return webpackConfig;
    },
  },
};
