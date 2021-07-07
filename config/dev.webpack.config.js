const { resolve, join } = require('path');
const config = require('@redhat-cloud-services/frontend-components-config');
const { defaultServices } = require('@redhat-cloud-services/frontend-components-config-utilities/standalone');
const commonPlugins = require('./plugins');
const srcDir = resolve(__dirname, '../src');

defaultServices.config.path = 'https://github.com/redallen/cloud-services-config#tmp/quickstarts';
const { config: webpackConfig, plugins } = config({
  rootFolder: resolve(__dirname, '..'),
  deployment: process.env.BETA ? 'beta/apps' : 'apps',
  appUrl: process.env.BETA ? '/beta/docs/cloud-tutorials' : '/docs/cloud-tutorials',
  standalone: defaultServices
});
webpackConfig.entry['quickstarts'] = {
  import: join(srcDir, 'quickstarts/qsEntry.ts'),
  filename: 'quickstarts.js',
  publicPath: '/hello',
  library: {
    name: 'quickstarts',
    type: 'window'
  }
};
webpackConfig.devServer = {
  ...webpackConfig.devServer,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
    "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
  }
};
console.log(webpackConfig);
plugins.push(...commonPlugins(webpackConfig));

module.exports = {
  ...webpackConfig,
  plugins,
};
