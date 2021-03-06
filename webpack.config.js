const path = require("path");

module.exports = {
  entry: {
    editor: "./src/editor.js",
    website: "./src/website.js",
  },
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
              "babel-plugin-root-import",
              [
                "inline-react-svg",
                {
                  svgo: {
                    plugins: [
                      {
                        removeAttrs: { attrs: "*:(stroke|stroke-width)" }, //remove svg "stroke" attrs (set by react)
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
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
  },
};
