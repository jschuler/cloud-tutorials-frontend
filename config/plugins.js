const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const AssetsPlugin = require('assets-webpack-plugin');

module.exports = config => [
  require('@redhat-cloud-services/frontend-components-config/federated-modules')(
    {
      root: path.resolve(__dirname, '../'),
      exposes: {
        './RootApp': path.resolve(__dirname, '../src/AppEntry.tsx'),
      },
    }
  ),
  new webpack.DefinePlugin({
    'QUICKSTARTS_BASE': `"${config.output.publicPath}quickstarts"`,
    'APP_BASE': `"${config.output.publicPath}"`,
    'TUTORIALS_BASE': `"${config.output.publicPath}tutorials"`
  }),
  new CopyWebpackPlugin({ patterns: [
    { from: path.join(__dirname, '../static'), to: '' },
    { from: path.resolve('src/quickstarts/chrome-plugin/plugin.css'), to: '' },
    { from: path.resolve('node_modules/@patternfly/quickstarts/dist/quickstarts.min.css'), to: '' },
    { from: path.resolve('node_modules/@patternfly/patternfly/patternfly.min.css'), to: '' },
    { from: path.resolve('node_modules/@patternfly/patternfly/utilities/Accessibility/accessibility.css'), to: '' },
    { from: path.resolve('node_modules/@patternfly/patternfly/patternfly-addons.css'), to: '' },
    { from: path.resolve('node_modules/@patternfly/react-catalog-view-extension/dist/css/react-catalog-view-extension.css'), to: '' },
    { from: path.resolve('node_modules/@patternfly/patternfly/assets'), to: 'assets' }
  ]}),
  new AssetsPlugin({
    path: 'static',
    removeFullPathAutoPrefix: true
  }),
];

