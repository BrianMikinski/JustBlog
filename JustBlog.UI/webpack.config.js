'use strict';

var path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    entry: './App/app.module.ts',
    mode: 'development',
    devtool: "inline-source-map",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['tsx','.ts', '.js'],
        plugins: [
            new CleanWebpackPlugin(['./dist']),
            new TsconfigPathsPlugin(
                {
                    baseUrl: "App",
                    configFile: "tsconfig.json"
                }),
        ]
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, './wwwroot'),
        sourceMapFilename: 'bundle.map'
    }
}

console.log(__dirname);