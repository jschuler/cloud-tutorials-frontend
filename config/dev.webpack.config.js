const { resolve } = require('path');
const config = require('@redhat-cloud-services/frontend-components-config');
const ModuleFederationPlugin = require("webpack").container
  .ModuleFederationPlugin;
const CopyPlugin = require("copy-webpack-plugin");
const { readFileSync } = require('fs');
const { dependencies} = require("../package.json");

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
    context: ['/api/mosaic/cloud-tutorials', '/walkthroughs'],
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
      mkUiFrontend: "mkUiFrontend@https://prod.foo.redhat.com:1337/remoteEntry.js",
      strimziUi: "strimziUi@http://localhost:8080/remoteEntry.js"
    },
    shared: {
      ...dependencies,
      react: {
        eager: true,
        singleton: true,
        requiredVersion: dependencies["react"],
      },
      "react-dom": {
        eager: true,
        singleton: true,
        requiredVersion: dependencies["react-dom"],
      },
      "asciidoctor": {
        eager: true,
        singleton: true,
        requiredVersion: dependencies["asciidoctor"],
      },
    }
  }),
)
webpackConfig.resolve.fallback = {
  "https": require.resolve("https-browserify"),
  "http": require.resolve("stream-http"),
  "path": require.resolve("path-browserify")
};
webpackConfig.entry = resolve(__dirname, '../src/entry.js');

module.exports = {
    ...webpackConfig,
    plugins
};
