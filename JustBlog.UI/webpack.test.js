﻿'use strict';

const path = require("path");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

const outputDirectory = "./wwwrootTest";

module.exports = {
    mode: "development",
    devtool: "inline-source-map",
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
            }
        ]
    },
    resolve: {
        extensions: ["tsx", ".ts", ".js"],
        plugins: [
            new CleanWebpackPlugin([outputDirectory]),
            new TsconfigPathsPlugin(
                {
                    baseUrl: "App",
                    configFile: "tsconfig.json"
                })
        ]
    },
    output: {
        sourceMapFilename: "bundle.map",
        path: path.resolve(__dirname, outputDirectory),
        filename: '[name].chunkhash.bundle.js',
        chunkFilename: '[name].chunkhash.bundle.js',
        publicPath: '/',
    }
}

console.log(__dirname);