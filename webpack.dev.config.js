const merge = require('webpack-merge');
const common = require('./webpack.common.config');
const webpack = require('webpack');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = merge(common, {
  // dev mode prevents bundle from minifying
  mode: 'development',
  // devtool specifies how info is shown in CLI
  devtool: 'cheap-module-source-map',
  devServer: {
    contentBase: './dist',
    historyApiFallback: true,
    hot: true
  },
  output: {
    filename: '[name].bundle.js',
    chunkFilename: '[name].chunk.js'
  },
  module: {
    rules: [
      {
        // "oneOf" will use only the first matching rule
        oneOf: [
          // "url" loader works like "file" loader except that it embeds assets
          // smaller than specified limit in bytes as data URLs to avoid requests.
          // A missing `test` is equivalent to a match.
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
            loader: require.resolve('url-loader'),
            options: {
              limit: 10000,
              name: 'static/media/[name].[hash:8].[ext]',
            },
          },
          {
            test: /\.(js|jsx|mjs)$/,
            exclude: /node_modules/,
            loader: require.resolve('babel-loader'),
            options: {
              // This is a feature of `babel-loader` for webpack (not Babel itself).
              // It enables caching results in ./node_modules/.cache/babel-loader/
              // directory for faster rebuilds.
              cacheDirectory: true
            },
          },
          // "postcss" loader applies autoprefixer to our CSS.
          // "css" loader resolves paths in CSS and adds assets as dependencies.
          // "style" loader turns CSS into JS modules that inject <style> tags.
          // In production, we use a plugin to extract that CSS to a file, but
          // in development "style" loader enables hot editing of CSS.
          {
            test: /\.(sc|sa|c)ss$$/,
            use: [
              'style-loader', // creates style nodes from JS strings
              {
                loader: 'css-loader', // translates CSS into CommonJS
                options: {
                  module: true
                }
              },
              'sass-loader' // compiles Sass to CSS, using Node Sass by default
            ]
          },
          {
            // Exclude `js` files to keep "css" loader working as it injects
            // its runtime that would otherwise processed through "file" loader.
            // Also exclude `html` and `json` extensions so they get processed
            // by webpacks internal loaders.
            exclude: [/\.(js|jsx|mjs)$/, /\.html$/, /\.json$/],
            loader: require.resolve('file-loader'),
            // options: {
            //   name: 'static/media/[name].[hash:8].[ext]',
            // },
          },
        ],
      },
      // **STOP** Make sure to add the new loader(s) before the "file" loader.
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    // Watcher doesn't work well if you mistype casing in a path so we use
    // a plugin that prints an error when you attempt to do this.
    // See https://github.com/facebookincubator/create-react-app/issues/240
    new CaseSensitivePathsPlugin(),
    new Dotenv({
      path: './.env.development' // load this now instead of the ones in '.env'
    })
  ]
});
