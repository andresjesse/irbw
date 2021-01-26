const path = require("path");

module.exports = {
  entry: "./src/index.js",
  devtool: "inline-source-map",
  devServer: {
    contentBase: "./dist",
  },
  mode: "development",
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-react", "@babel/preset-env"],
            plugins: [
              [
                "inline-react-svg",
                {
                  svgo: {
                    plugins: [
                      {
                        removeAttrs: { attrs: "g:stroke" }, //remove svg "stroke" color
                      },
                      {
                        cleanupIDs: true,
                      },
                    ],
                  },
                },
              ],
            ],
          },
        },
      },
    ],
  },
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
  },
};
