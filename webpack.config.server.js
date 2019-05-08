const path = require("path");
const node_externals = require("webpack-node-externals");

module.exports = {
  entry: { server: path.join(__dirname, "./server/server.js") },
  output: {
    path: path.join(__dirname, "/dist"),
    publicPath: "/dist/",
    filename: "[name].js"
  },
  target: "node",
  node: {
    __dirname: false,
    __filename: false
  },
  externals: [node_externals()],
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  }
};
