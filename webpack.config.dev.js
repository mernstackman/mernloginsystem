const path = require("path");
const htmlWebpackPlugin = require("html-webpack-plugin");
// const prettierWebpackPlugin = require("prettier-webpack-plugin");
// const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  mode: "development",
  entry: {
    main: "./frontend/main.js"
  },
  output: {
    path: path.join(__dirname, "/dist/frontend"),
    publicPath: "/public/",
    filename: "[name].js"
  },
  target: "web",
  devtool: "#source-map",
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        // Insert javascript into html template provided, in this case is index.html
        test: /\.html$/,
        use: [
          {
            loader: "html-loader"
          }
        ]
      },
      {
        test: /\.(s*)css$/,
        use: [
          "style-loader/url",
          {
            loader: "file-loader",
            options: {
              name: "css/[name].css"
            }
          },
          // "css-loader",
          "postcss-loader",
          "sass-loader"
        ]
        // the order should like this, or it will throw error on build
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|bmp|tga)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "img/[name].[ext]"
            }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: [".js", ".jsx"]
  },
  plugins: [
    new htmlWebpackPlugin({
      template: "./frontend/index.html",
      filename: "../index.html",
      excludeChunks: ["server"]
    })
  ],
  optimization: {
    noEmitOnErrors: true
  }
};
