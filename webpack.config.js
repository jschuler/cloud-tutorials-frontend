const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlReplaceWebpackPlugin = require('html-replace-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const GitRevisionPlugin = require('git-revision-webpack-plugin');
const { getProxyPaths, getHtmlReplacements } = require('@redhat-cloud-services/insights-standalone');
const AssetsPlugin = require('assets-webpack-plugin');
const { name } = require('./package.json');

const fileRegEx = /\.(png|woff|woff2|eot|ttf|svg|gif|jpe?g|png)(\?[a-z0-9=.]+)?$/;
const srcDir = path.resolve(__dirname, './src');
const gitRevisionPlugin = new GitRevisionPlugin({ branch: true });
const betaBranches = ['master', 'qa-beta', 'ci-beta', 'prod-beta'];

module.exports = (_env, argv) => {
  const gitBranch = process.env.TRAVIS_BRANCH || process.env.BRANCH || gitRevisionPlugin.branch();
  const isProduction = argv.mode === 'production';
  const appDeployment = (isProduction && betaBranches.includes(gitBranch)) ? '/beta' : '';
  const publicPath = `${appDeployment}/apps/${name}/`;
  const port = 4567;

  console.log('~~~Using variables~~~');
  console.log(`isProduction: ${isProduction}`);
  console.log(`Current branch: ${gitBranch}`);
  console.log(`Beta branches: ${betaBranches}`);
  console.log(`Using deployments: ${appDeployment}`);
  console.log(`Public path: ${publicPath}`);
  console.log('~~~~~~~~~~~~~~~~~~~~~');

  return {
    stats: {
      excludeAssets: fileRegEx,
      colors: true,
      modules: false,
    },
    mode: isProduction ? 'production' : 'development',
    devtool: isProduction ? 'source-map' : 'inline-cheap-source-map',
    entry: {
      launcher: path.join(srcDir, 'launcher/entry.ts'),
      quickstarts: {
        import: path.join(srcDir, 'quickstarts/entry.ts'),
        filename: 'quickstarts.js',
        library: {
          name: 'quickstarts',
          type: 'window'
        }
      }
    },
    output: {
      path: path.resolve(__dirname, './dist/'),
      filename: isProduction ? '[name].[chunkhash].js' : '[name].js',
      publicPath,
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          include: srcDir,
          use: 'ts-loader'
        },
        {
          test: /\.css$/i,
          exclude: /@patternfly\/react-styles\/css/,
          use: [MiniCssExtractPlugin.loader, 'css-loader'],
        },
        {
          // Since we use Insights' upstream PatternFly, we're using null-loader to save about 1MB of CSS
          test: /\.css$/i,
          include: /@patternfly\/react-styles\/css/,
          use: 'null-loader',
        },
        {
          test: fileRegEx,
          type: 'asset/resource',
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        'QUICKSTARTS_BASE': `"https://${isProduction ? 'cloud.redhat.com' : 'localhost:' + port}${publicPath}quickstarts"`,
        'TUTORIALS_BASE': `"https://${isProduction ? 'cloud.redhat.com' : 'localhost:' + port}${publicPath}tutorials"`
      }),
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        chunks: ['launcher'],
        template: path.join(srcDir, 'launcher/index.html'),
      }),
      new HtmlReplaceWebpackPlugin([
        {
          pattern: '@@env',
          replacement: appDeployment,
        },
        ...(isProduction ? [] : getHtmlReplacements())
      ]),
      new MiniCssExtractPlugin({
        filename: isProduction ? '[id].[contenthash].css' : '[name].css',
        chunkFilename: isProduction ? '[id].[contenthash].css' : '[id].css',
      }),
      new CopyWebpackPlugin({ patterns: [
        { from: path.join(__dirname, 'static'), to: '' }
      ]}),
      new CopyWebpackPlugin({ patterns: [
        { from: path.resolve('node_modules/@cloudmosaic/quickstarts/dist/quickstarts.min.css'), to: '' }
      ]}),
      new CopyWebpackPlugin({ patterns: [
        { from: path.resolve('node_modules/@patternfly/patternfly/patternfly.min.css'), to: '' }
      ]}),
      new CopyWebpackPlugin({ patterns: [
        { from: path.resolve('node_modules/@patternfly/patternfly/utilities/Accessibility/accessibility.css'), to: '' }
      ]}),
      new CopyWebpackPlugin({ patterns: [
        { from: path.resolve('node_modules/@patternfly/react-catalog-view-extension/dist/css/react-catalog-view-extension.css'), to: '' }
      ]}),
      new CopyWebpackPlugin({ patterns: [
        { from: path.resolve('node_modules/@patternfly/patternfly/assets'), to: 'assets' }
      ]}),
      new AssetsPlugin({
        path: 'static',
        removeFullPathAutoPrefix: true
      }),
    ],
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    devServer: {
      client: {
        host: 'localhost'
      },
      port,
      host: 'localhost',
      https: true,
      firewall: false,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
        "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
      },
      hot: false,
      injectHot: false,
      historyApiFallback: {
        index: `${publicPath}index.html`
      },
      proxy: getProxyPaths({ publicPath, webpackPort: port }),
    },
  };
};
