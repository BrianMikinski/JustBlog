﻿'use strict';

const path = require("path");
const webpack = require('webpack');
const { CleanWebpackPlugin }= require("clean-webpack-plugin");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

const outputDirectory = "./wwwroot";

module.exports = {
    mode: "development",
    devtool: "inline-source-map",
    entry: {
        app: "./app/app.module.ts",
        vendors: ["jquery",
            "bootstrap",
            "toastr",
            "tinymce",
            "angular",
            "@uirouter/angularjs/release/angular-ui-router",
            "angular-animate",
            "angular-sanitize",
            "@uirouter/visualizer",
            "angular-ui-bootstrap",
            "angular-ui-tinymce"]
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
                exclude: /node_modules/
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name: "[name].html"
                        }
                    },
                    {
                        loader: "extract-loader"
                    },
                    {
                        loader: "html-loader",
                        options: {
                            attrs: ['img:src']
                        }
                    }
                ]
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
                loader: "file-loader?name=fonts/[name].[ext]"
            },
            {
                test: require.resolve('tinymce/tinymce'),
                use: [
                    'imports-loader?this=>window',
                    'exports-loader?window.tinymce'
                ]
            },
            {
                test: /tinymce[\\/]themes[\\/]//*/tinymce\/(themes|plugins)\//*/,
                use: [
                    'imports-loader?this=>window'
                ]
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
        //new webpack.ProgressPlugin(),
        new CleanWebpackPlugin()
        //new webpack.PrefetchPlugin([context], request)
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
            cacheGroups: {
                vendor: {
                    chunks: 'initial',
                    name: 'vendors',
                    test: 'vendors',
                    enforce: true
                }
            }
        },
        runtimeChunk: true
    }
};

console.log(__dirname);