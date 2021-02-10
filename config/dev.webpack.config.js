const { resolve } = require('path');
const config = require('@redhat-cloud-services/frontend-components-config');
const ModuleFederationPlugin = require("webpack").container
  .ModuleFederationPlugin;
const CopyPlugin = require("copy-webpack-plugin");
const { readFileSync } = require('fs');

const chromePath = resolve(__dirname, '../../standalone-crc/packages/insights-chrome/build'); 
const landingPath = resolve(__dirname, '../../standalone-crc/packages/landing-page-frontend/dist');
const configPath = resolve(__dirname, '../../cloud-services-config'); 
const { config: webpackConfig, plugins } = config({
    rootFolder: resolve(__dirname, '../'),
    debug: true,
    replacePlugin: [
      {
        pattern: /<\s*esi:include\s+src\s*=\s*"([^"]+)"\s*\/\s*>/gm,
        replacement(_match, file) {
          file = file.split('/').pop();
          const snippet = resolve(chromePath, 'snippets', file);
          return readFileSync(snippet);
        }
      },
    ]
});
webpackConfig.devServer.proxy = [
 {
    context: ['/api/mosaic/cloud-tutorials'],
    target: 'http://localhost:5001',
    secure: false,
    pathRewrite: { '^/api/mosaic/cloud-tutorials': '' },
    changeOrigin: true
  },
  {
    context: ['/api'],
    target: 'http://localhost:3000',
    secure: false,
    changeOrigin: true
  },
 ];
plugins.push(new CopyPlugin({
  patterns: [
    { from: chromePath, to: 'apps/chrome' },
    { from: landingPath, to: '' },
    { from: resolve(__dirname, '../public'), to: '' },
    { from: configPath, to: 'config' },
  ]
}));
plugins.push(
  new ModuleFederationPlugin({
    name: "app1",
    remotes: {
      app2: "app2@http://localhost:3002/remoteEntry.js",
      mkUiFrontend: "mkUiFrontend@http://localhost:9000/remoteEntry.js"
    },
    shared: ["react", "react-dom"],
  }),
)
webpackConfig.resolve.fallback = {
  "https": require.resolve("https-browserify"),
  "http": require.resolve("stream-http"),
  "path": require.resolve("path-browserify")
};
webpackConfig.resolve.alias = {'asciidoctor.js': 'asciidoctor'};
webpackConfig.entry = resolve(__dirname, '../src/entry.js');

module.exports = {
    ...webpackConfig,
    plugins
};
