const HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack").container
  .ModuleFederationPlugin;
const path = require("path");

module.exports = {
  entry: "./src/index",
  mode: "development",
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    port: 3002,
  },
  output: {
    publicPath: "auto",
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: "babel-loader",
        exclude: /node_modules/,
        options: {
          presets: ["@babel/preset-react"],
        },
      },
      {
        test: /\.css$/i,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader"
        ],
      },
      {
        test: /\.(svg|ttf|eot|woff|woff2)$/,
        // only process modules with this loader
        // if they live under a 'fonts' or 'pficon' directory
        include: [
          path.resolve(__dirname, 'node_modules/patternfly/dist/fonts'),
          path.resolve(__dirname, 'node_modules/@patternfly/react-core/dist/styles/assets/fonts'),
          path.resolve(__dirname, 'node_modules/@patternfly/react-core/dist/styles/assets/pficon'),
          path.resolve(__dirname, 'node_modules/@patternfly/patternfly/assets/fonts'),
          path.resolve(__dirname, 'node_modules/@patternfly/patternfly/assets/pficon')
        ],
        use: {
          loader: 'file-loader',
          options: {
            // Limit at 50k. larger files emited into separate files
            limit: 5000,
            outputPath: 'fonts',
            name: '[name].[ext]'
          }
        }
      },
      {
        test: /\.svg$/,
        include: input => input.indexOf('background-filter.svg') > 1,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 5000,
              outputPath: 'svgs',
              name: '[name].[ext]'
            }
          }
        ]
      },
      {
        test: /\.(jpg|jpeg|png|gif)$/i,
        include: [
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, 'node_modules/patternfly'),
          path.resolve(__dirname, 'node_modules/@patternfly/patternfly/assets/images'),
          path.resolve(__dirname, 'node_modules/@patternfly/react-styles/css/assets/images'),
          path.resolve(__dirname, 'node_modules/@patternfly/react-core/dist/styles/assets/images'),
          path.resolve(__dirname, 'node_modules/@patternfly/react-core/node_modules/@patternfly/react-styles/css/assets/images'),
          path.resolve(__dirname, 'node_modules/@patternfly/react-table/node_modules/@patternfly/react-styles/css/assets/images'),
          path.resolve(__dirname, 'node_modules/@patternfly/react-inline-edit-extension/node_modules/@patternfly/react-styles/css/assets/images')
        ],
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 5000,
              outputPath: 'images',
              name: '[name].[ext]'
            }
          }
        ]
      }
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "app2",
      filename: "remoteEntry.js",
      exposes: {
        "./AppOne": "./src/AppOne",
        "./AppTwo": "./src/AppTwo",
        "./AppThree": "./src/AppThree",
      },
      shared: ["react", "react-dom"],
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
};
