const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

const devMode = process.env.NODE_ENV === "development";

const srcPath = path.resolve(__dirname, "src");

const filename = (ext) =>
  devMode ? `[name].${ext}` : `[name].[contenthash].${ext}`;

module.exports = {
  mode: devMode ? "development" : "production",
  context: srcPath,
  entry: "/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: `js/${filename("js")}`,
    clean: true,
    assetModuleFilename: "[file]",
  },
  devServer: {
    port: 8080,
    compress: true,
    hot: true,
    static: {
      directory: path.resolve(__dirname, "src"),
    },
    open: true,
  },

  devtool: devMode ? "source-map" : false,

  plugins: [
    new HTMLWebpackPlugin({
      template: path.resolve(__dirname, "src/index.html"),
      filename: "index.html",
      minify: {
        collapseWhitespace: !devMode,
      },
    }),
    new MiniCssExtractPlugin({
      filename: `css/${filename("css")}`,
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "src/assets"),
          to: path.resolve(__dirname, "dist/assets"),
        },
      ],
    }),
  ],

  module: {
    rules: [
      {
        test: /\.(?:ico|gif|png|jpg|jpeg|svg|webp)$/i,
        type: "asset/resource",
      },
      {
        test: /\.(?:mp3|wav|ogg|mp4)$/i,
        type: "asset/resource",
      },
      {
        test: /\.(woff(2)?|eot|ttf|otf)$/i,
        type: "asset/resource",
      },
      {
        test: /\.css$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: { publicPath: "../" },
          },
          "css-loader",
        ],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: { publicPath: "../" },
          },
          "css-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
    ],
  },
  optimization: {
    minimizer: [
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminMinify,
          options: {
            plugins: [
              ["gifsicle", { interlaced: true }],
              ["jpegtran", { progressive: true }],
              ["optipng", { optimizationLevel: 5 }],
              [
                "svgo",
                {
                  plugins: [
                    {
                      name: "preset-default",
                      params: {
                        overrides: {
                          removeViewBox: false,
                          addAttributesToSVGElement: {
                            params: {
                              attributes: [
                                { xmlns: "http://www.w3.org/2000/svg" },
                              ],
                            },
                          },
                        },
                      },
                    },
                  ],
                },
              ],
            ],
          },
        },
      }),
    ],
  },
};
