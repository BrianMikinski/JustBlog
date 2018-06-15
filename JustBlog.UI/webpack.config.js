var path = require('path');

module.exports = {
    entry: './App/app.module.ts',
    mode: 'development',
    devtool: "inline-source-map",
    module: {
        rules: [
            {
                test: /\.tsx?$/, 
                //exclude: /(node_modules|bower_components),
                loader: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.ts' , '.js']
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    }
}

console.log(__dirname);