const { resolve } = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");

const devMode = process.env.NODE_ENV !== "production";
const srcPath = resolve(__dirname, "src");
const distPath = resolve(__dirname, "dist");
const wasmFile = resolve(
  __dirname,
  "node_modules",
  "mediainfo.js",
  "dist",
  "MediaInfoModule.wasm"
);

module.exports = {
  mode: devMode ? "development" : "production",
  entry: { app: resolve(srcPath, "index.tsx") },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: "src/index.html",
    }),
    new CopyPlugin({
      patterns: [{ from: wasmFile, to: "." }],
    }),
  ],
  output: {
    path: distPath,
    filename: "mediainfo-demo.js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
      {
        test: /\.(ts|js)x?$/i,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env",
              "@babel/preset-react",
              "@babel/preset-typescript",
            ],
          },
        },
      },
      {
        test: /\.sass$/,
        use: [
          devMode ? "style-loader" : MiniCssExtractPlugin.loader,
          "css-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.(png|woff2)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 8192,
              name: "[name].[ext]",
              outputPath: ".",
            },
          },
        ],
      },
      {
        test: /favicon\.png$/,
        use: [
          {
            loader: "file-loader",
            options: { name: "[name].[ext]" },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ["*", ".js"],
  },
  externals: ["fs"],
  ...(devMode ? { devtool: "inline-source-map" } : {}),
};
