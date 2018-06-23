const path = require("path");
const webpack = require("webpack");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const merge = require("webpack-merge");
const common = require("./webpack.common.js");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const autoprefixer = require("autoprefixer");
const prodConfig = {
  mode: "production",
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.(scss|sass|css)$/,
        oneOf: [
          // this matches `<style module>`
          {
            resourceQuery: /module/,
            use: [
              "vue-style-loader",
              MiniCssExtractPlugin.loader,
              {
                loader: "css-loader",
                options: {
                  modules: true,
                  localIdentName: "[local]_[hash:base64:5]"
                }
              },
              {
                loader: "postcss-loader",
                options: {
                  plugins: () => [autoprefixer()]
                }
              },
              "sass-loader"
            ]
          },
          // this matches plain `<style>` or `<style scoped>`
          {
            use: [
              "vue-style-loader",
              MiniCssExtractPlugin.loader,
              "css-loader",
              {
                loader: "postcss-loader",
                options: {
                  plugins: () => [autoprefixer()]
                }
              },
              "sass-loader"
            ]
          }
        ]
      }
    ]
  },
  optimization: {
    minimizer: [
      new UglifyJSPlugin({
        sourceMap: true,
        cache: true,
        parallel: true,
        sourceMap: true // set to true if you want JS source maps
      }),
      new OptimizeCSSAssetsPlugin({})
    ],
    splitChunks: {
      chunks: "all"
    }
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    }),
    new UglifyJSPlugin({
      sourceMap: true
    }),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("production")
    })
  ]
};

module.exports = env => {
  return common.map(entrypoint => merge(entrypoint, prodConfig));
};
