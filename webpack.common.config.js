const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on("unhandledRejection", err => {
  throw err;
});

module.exports = {
  entry: {
    // In webpack version < 4 it was common to add vendors as separate entrypoint to compile it
    // as separate file (in combination with the CommonsChunkPlugin). This is discouraged in
    // webpack 4. Instead the optimization.splitChunks option takes care of separating vendors
    // and app modules and creating a separate file. Do not create a entry for vendors or
    // other stuff which is not the starting point of execution.
    // Hence below vendors may need to be refactored.
    // NB: The entry points will help optimization.splitChunks decide how to chunk the bundles
    app: "./src/index.js",
    vendors: "./src/vendors/vendors.js"
  },
  output: {
    path: path.resolve(__dirname, "build"),
    publicPath: "/"
  },
  plugins: [
    new CleanWebpackPlugin(["build"]),
    // Generates an `index.html` file with the <script> injected.
    new HtmlWebpackPlugin({
      title: "Project Issues Suite",
      inject: true,
      template: "./index.html",
      filename: "./index.html"
    })
  ],
  module: {
    rules: [
      {
        enforce: "pre",
        test: /\.(js|jsx|mjs)$/,
        exclude: /node_modules/,
        loader: "eslint-loader"
      }
    ]
  },
  resolve: {
    alias: {
      // allows import by calling 'vendors' rather then traversing relative paths: '../../src/vendors'
      vendors$: path.resolve(__dirname, "src/vendors/vendors.js")
    }
  }
};
