const { resolve } = require('path');
const config = require('@redhat-cloud-services/frontend-components-config');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const commonPlugins = require('./plugins');

const { config: webpackConfig, plugins } = config({
  rootFolder: resolve(__dirname, '../'),
  deployment: process.env.BETA ? 'beta/apps' : 'apps',
});
plugins.push(...commonPlugins);

module.exports = env => {
  if (env && env.analyze === 'true') {
    plugins.push(new BundleAnalyzerPlugin());
  }
  return {
    ...webpackConfig,
    plugins,
  };
};
