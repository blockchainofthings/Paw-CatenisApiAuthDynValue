/**
 * Created by claudio on 25/02/17.
 */
import path from 'path';

const name = 'CatenisApiAuthDynValue';

const config = {
    target: 'web',
    mode: 'production',
    entry: [
        'immutable',
        './src/CatenisApiAuthDynValue.js'
    ],
    output:{
        path: path.resolve(__dirname, './build/com.blockchainofthings.PawExtensions.' + name),
        publicPath: '/build/',
        filename: name + '.js'
    },
    module: {
        rules: [{
            use: [{
                loader: 'babel-loader',
            }],
            include: [
                path.resolve(__dirname, './src')
            ],
            test: /\.jsx?$/
        }]
    }
};

module.exports = config;
