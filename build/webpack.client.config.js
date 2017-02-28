const path = require('path');
const webpack = require('webpack')
const base = require('./webpack.base.config')
const vueConfig = require('./vue-loader.config')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const config = Object.assign({}, base, {
    plugins: (base.plugins || []).concat([
        // strip comments in Vue code
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
            '__DEV__': process.env.NODE_ENV !== 'production',
            '__PROD__': process.env.NODE_ENV === 'production',
        }),
        // extract vendor chunks for better caching
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: 'client-vendor.js'
        })
    ])
})

if (process.env.NODE_ENV === 'production') {
    // Use ExtractTextPlugin to extract CSS into a single file
    // so it's applied on initial render
    const ExtractTextPlugin = require('extract-text-webpack-plugin')
        // vueConfig is already included in the config via LoaderOptionsPlugin
        // here we overwrite the loader config for <style lang="stylus">
        // so they are extracted.
    vueConfig.loaders = {
        sass: ExtractTextPlugin.extract({
            loader: 'css-loader?name=css/[name]-[hash:5].[ext]!sass-loader',
            fallbackLoader: 'vue-style-loader' // <- this is a dep of vue-loader
        }),
        css: ExtractTextPlugin.extract({
            loader: 'css-loader?name=css/[name]-[hash:5].[ext]',
            fallbackLoader: 'vue-style-loader' // <- this is a dep of vue-loader
        }),
    }
    config.devtool = false;
    config.plugins.push(
        new ExtractTextPlugin('css/styles.css'),
        // this is needed in webpack 2 for minifying CSS
        new webpack.LoaderOptionsPlugin({
            minimize: true
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    );
}

config.plugins.push(new HtmlWebpackPlugin({
    template: path.resolve(__dirname, '../src/index.html'),
    hash: true,
    filename: path.resolve(__dirname, '../server/static/index.html'),
    minify: false,
    inject: 'body'
}))


module.exports = config
