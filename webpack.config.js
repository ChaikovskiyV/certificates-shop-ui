const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const webpack = require("webpack");

module.exports = {
    entry: {
        main: path.resolve(__dirname, "./src/index.js"),
    },
    output: {
        //publicPath: "./",
        path: path.resolve(__dirname, "./public"),
        filename: "main.js"
    },
    mode: "development",
    devServer: {
        historyApiFallback: true,
        compress: true,
        hot: true,
        static: {
            directory: path.join(__dirname, "./public")
        },
        port: 3000,
        open: true
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules, images)/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            ["@babel/preset-env", { targets: "defaults" }]
                        ]
                    }
                }
            },
            {
                test: /\.css$/,
                use: [
                    { loader: "style-loader" },
                    {
                        loader: "css-loader",
                        options: {
                            url: false
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: "React App",
            template: path.resolve(__dirname, "./src/template.html"),
            filename: "index.html"
        }),
        new CleanWebpackPlugin(),
        new webpack.ProvidePlugin({ "React": "react" })
    ]
}