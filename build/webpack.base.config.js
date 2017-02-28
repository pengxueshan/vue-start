const path = require('path')
const vueConfig = require('./vue-loader.config')

module.exports = {
    devtool: '#source-map',
    entry: {
        app: './src/client-entry.js',
        vendor: [
            'vue', 'vue-router', 'vuex', 'lru-cache', 'es6-promise'
        ]
    },
    output: {
        path: path.resolve(__dirname, '../server/static/dist'),
        publicPath: '/dist/',
        filename: 'client-bundle.js',
        chunkFilename: '[name].js',
    },
    resolve: {
        extensions: ['.js', '.vue']
    },
    module: {
        rules: [{
            test: /\.vue$/,
            loader: 'vue-loader',
            options: vueConfig
        }, {
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: /node_modules/
        }, {
            test: /\.(png|jpg|gif|svg)$/,
            loader: 'url-loader',
            options: {
                limit: 1,
                name: 'imgs/[name].[ext]?[hash:5]'
            }
        }, {
            test: /\.css$/,
            loader: 'css-loader',
            options: {
                name: 'css/[name]-[hash:5].[ext]',
            }
        }, {
            test: /\.woff(\?\S*)?$/,
            loader: 'url-loader?name=fonts/[name].[ext]&limit=10000&mimetype=application/font-woff'
        }, {
            test: /\.woff2(\?\S*)?$/,
            loader: 'url-loader?name=fonts/[name].[ext]&limit=10000&mimetype=application/font-woff'
        }, {
            test: /\.ttf(\?\S*)?$/,
            loader: 'url-loader?name=fonts/[name].[ext]&limit=10000&mimetype=application/octet-stream'
        }, {
            test: /\.eot(\?\S*)?$/,
            loader: 'file-loader?name=fonts/[name].[ext]&limit=10000&mimetype=application/vnd.ms-fontobject'
        }, {
            test: /\.svg(\?\S*)?$/,
            loader: 'url-loader?name=fonts/[name].[ext]&limit=10000&mimetype=image/svg+xml'
        }],
    },
}
