const path = require("path");

const VueLoaderPlugin = require("vue-loader/lib/plugin");
// using webpack-merge so we don't have to repeat common configuration attributes twice
const merge = require("webpack-merge");

const NpmInstallPlugin = require("webpack-plugin-install-deps");
const CleanWebpackPlugin = require('clean-webpack-plugin');

  const sharedConfig = () => ({
    mode: "development",
    stats: { modules: false },
    resolve: { extensions: [".js", ".vue", ".ts"] },
    output: {
      filename: "[name].js",
      publicPath: "/dist/"
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: "vue-loader"
        },
        {
          test: /\.js$/,
          loader: "babel-loader",
          include: __dirname,
          exclude: file => /node_modules/.test(file) && !/\.vue\.js/.test(file)
        },
        {
          test: /\.ts$/,
          exclude: file => /node_modules/.test(file) && !/\.vue\.ts/.test(file),
          use: [
            "babel-loader",
            {
              loader: "ts-loader",
              options: {
                appendTsSuffixTo: [/\.vue$/]
              }
            },
            "ts-nameof-loader"
          ]
        }
      ]
    },
      plugins: [
         new CleanWebpackPlugin(),
          new VueLoaderPlugin(),
          new NpmInstallPlugin()]
  });



  const clientBundleConfig = merge(sharedConfig(), {
    entry: { "main-client": "./ClientApp/client.ts" },
    output: {
      path: path.join(__dirname, "wwwroot/dist")
    }
  });

  const serverBundleConfig = merge(sharedConfig(), {
    target: "node",
    entry: { "main-server": "./ClientApp/server.ts" },
    output: {
      libraryTarget: "commonjs2",
      path: path.join(__dirname, "wwwroot/dist")
    }
  });

  module.exports =  [clientBundleConfig, serverBundleConfig];
