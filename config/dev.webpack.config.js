const { resolve } = require('path');
const config = require('@redhat-cloud-services/frontend-components-config');
const ModuleFederationPlugin = require("webpack").container
  .ModuleFederationPlugin;
const { config: webpackConfig, plugins } = config({
  rootFolder: resolve(__dirname, '../'),
  debug: true,
  https: true,
  useFileHash: false,
});
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

module.exports = {
  ...webpackConfig,
  plugins,
};
