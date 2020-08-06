const { merge} = require('webpack-merge');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const babelOptions = require('./babel.config');


module.exports = merge({}, {
    entry: {
        extension: path.resolve(__dirname, '../src/extension.ts')
    },
    output: {
        path: path.resolve(__dirname, '../build'),
        filename: '[name].js',
        libraryTarget: 'commonjs2',
    },
    mode: "development",
    module: {
        rules: [
            {
                test: /\.(j|t)sx?$/,
                include: path.resolve(__dirname, '../src'),
                use: {
                    loader: 'babel-loader',
                    options: babelOptions
                }
            },
        ]
    },
    devtool: "source-map",
    target: "node",
    externals: {
        vscode: 'commonjs vscode'
    },
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '*'],
    },
    plugins: [
        new CleanWebpackPlugin({ cleanOnceBeforeBuildPatterns: ['build/*',] }),
    ],
}) 