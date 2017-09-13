/**
 * @desc webpack configuration for development
 */
import webpack from 'webpack';
import merge from 'webpack-merge';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import FriendlyErrorsPlugin from 'friendly-errors-webpack-plugin';
import baseConfig from './webpack.config.base.js';
import { styleLoaders } from './utils';
import config from '../config';

export default merge(baseConfig, {
    entry: {
        app: ['./tools/dev-client', './src/main.js'],
    },
    output: {
        publicPath: config.dev.assetsPublicPath,
    },
    module: {
        rules: styleLoaders({ sourceMap: config.dev.cssSourceMap }),
    },
    // cheap-module-eval-source-map is faster for development
    devtool: '#cheap-module-eval-source-map',
    plugins: [
        new webpack.DefinePlugin({
            'process.env': config.dev.env,
        }),
        // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        // https://github.com/ampedandwired/html-webpack-plugin
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'index.html',
            inject: true,
            nodeEnv: 'development',
        }),
        new FriendlyErrorsPlugin(),
    ],
});
