const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlReplaceWebpackPlugin = require('html-replace-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const GitRevisionPlugin = require('git-revision-webpack-plugin');
const { getProxyPaths, getHtmlReplacements } = require('@redhat-cloud-services/insights-standalone');
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
  // Moved multiple entries to index.tsx in order to help speed up webpack
  const entry = path.join(srcDir, 'entry.ts');

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
    devtool: 'source-map', // isProduction ? 'source-map' : 'eval',
    entry,
    output: {
      path: path.resolve(__dirname, './dist/'),
      filename: isProduction ? '[chunkhash].bundle.js' : '[name].bundle.js',
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
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: path.join(srcDir, 'index.html'),
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
    ],
    optimization: {
      runtimeChunk: true,
      splitChunks: {
        chunks: 'all'
      },
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    devServer: {
      port,
      writeToDisk: true,
      historyApiFallback: {
        index: `${publicPath}index.html`
      },
      proxy: getProxyPaths({ publicPath, webpackPort: port })
    },
  };
};
