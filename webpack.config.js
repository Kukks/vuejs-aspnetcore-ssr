const merge = require("webpack-merge");
const common = require("./webpack.common.js");
const autoprefixer = require("autoprefixer");

module.exports = env => {
  return common.map(entrypoint => merge(entrypoint, {
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
    }
  }));
};
