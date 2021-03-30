'use strict';

const path = require("path");
const webpack = require('webpack');
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const fs = require('fs');

const outputDirectory = "./wwwroot";

module.exports = {
    mode: "development",
    devtool: "inline-source-map",
    stats: "verbose",
    cache: {
        type: 'filesystem'
    },
    entry: {
        app: "./app/app.module.ts"
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
                exclude: /node_modules/
            },
            {
                test: /\.worker\.js$/,
                use: {
                    loader: "worker-loader"
                },
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name: "[name].html",
                            esModule: false
                        }
                    },
                    {
                        loader: "extract-loader"
                    },
                    {
                        loader: "html-loader",
                        options: {
                            sources: true, // required to include all images in
                            attrs: ['img:src']
                        }
                    }
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    "style-loader",
                    "css-loader",
                    "sass-loader"],
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: "style-loader"
                    },
                    {
                        loader: "css-loader"
                    }
                ]
            },
            {
                test: /\.(jpg|gif|png)$/,
                loader: "file-loader",
                options: {
                    name: "[name].[ext]",
                    outputPath: "img/",
                    publicPath: "img/"
                }
            },
            {
                test: /\.(woff2?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                options: {
                    name: "fonts/[name].[ext]"
                },
                loader: "file-loader"
            }
        ]
    },
    resolve: {
        extensions: ["tsx", ".ts", ".js"],
        // different from main plugins
        plugins: [
            new TsconfigPathsPlugin(
                {
                    baseUrl: "App",
                    configFile: "tsconfig.json"
                })
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new webpack.ProvidePlugin({
            jQuery: 'jquery'
        })
    ],
    output: {
        sourceMapFilename: "bundle.map",
        path: path.resolve(__dirname, outputDirectory),
        filename: '[name].chunkhash.bundle.js',
        chunkFilename: '[name].chunkhash.bundle.js',
        publicPath: '/'
    },
    optimization: {
        splitChunks: {
            chunks: "initial",
            cacheGroups: {
                vendors: {
                    name: 'vendor',
                    test: /[\\/]node_modules[\\/]/,
                    enforce: true,
                    priority: 10
                }
            }
        },
        runtimeChunk: true
    },
    devServer: {
        // these three properties are for using https during local development; if you do not use this then you can skip these
        pfx: fs.readFileSync(path.resolve(__dirname, 'localhost.pfx')),
        pfxPassphrase: 'abc123', // this password is also hard coded in the build script which makes the certificates
        https: true,

        // this is where the webpack-dev-server starts serving files from, so if the web client requests https://localhost:8400/vendor.js this will serve the built file vendor.js
        publicPath: '/',

        // this is where static files are stored; in this example the physical path ./wwwroot/dist/some/image.jpg will be attainable via https://localhost:8400/dist/some/image.jpg
        contentBase: path.resolve(__dirname, './wwwroot'), // you will need to change this to your own dist path

        // this enabled hot module replacement of modules so when you make a change in a javascript or css file the change will reflect on the browser
        hot: true,
        // port that the webpack-dev-server runs on; must match the later configuration where ASP.NET Core knows where to execute
        port: 8400,

        // this uses websockets for communication for hot module reload, and websockets are planned to be the default for the 5.x release
        transportMode: 'ws',

        // dev server will usually server all content from memory but this will write back to the disk in the folder we expect it to go to
        writeToDisk: true
    },
};

console.log(__dirname);