/**
 * @desc get webpack configuration
 */
import path from 'path';
import webpack from 'webpack';
import formatter from 'eslint-friendly-formatter';
import merge from 'webpack-merge';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import FriendlyErrorsPlugin from 'friendly-errors-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import OptimizeCSSPlugin from 'optimize-css-assets-webpack-plugin';
import CompressionWebpackPlugin from 'compression-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { assetsPath, styleLoaders } from './utils';
import vueLoaderConfig from './loaders';
import config from '../config';

function resolve(dir) {
    return path.join(__dirname, '..', dir);
}

export const baseConfig = {
    entry: {
        app: './src/main.js',
    },
    output: {
        path: config.build.assetsRoot,
        filename: '[name].js',
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js', // eslint-disable-line quote-props
            '@': resolve('src'),
        },
    },
    module: {
        rules: [
            {
                test: /\.(js|vue)$/,
                loader: 'eslint-loader',
                enforce: 'pre',
                include: [resolve('src'), resolve('test')],
                options: {
                    formatter,
                },
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: vueLoaderConfig,
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [resolve('src'), resolve('test')],
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: assetsPath('img/[name].[hash:7].[ext]'),
                },
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: assetsPath('media/[name].[hash:7].[ext]'),
                },
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: assetsPath('fonts/[name].[hash:7].[ext]'),
                },
            },
        ],
    },
};

/**
 * 开发环境下webpack配置
 */
export const devConfig = merge(baseConfig, {
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
        }),
        new FriendlyErrorsPlugin(),
    ],
});

/**
 * 生产环境webpack配置
 */
export const buildConfig = merge(baseConfig, {
    module: {
        rules: styleLoaders({
            sourceMap: config.build.productionSourceMap,
            extract: true,
        }),
    },
    devtool: config.build.productionSourceMap ? '#source-map' : false,
    output: {
        path: config.build.assetsRoot,
        filename: assetsPath('js/[name].[chunkhash].js'),
        chunkFilename: assetsPath('js/[id].[chunkhash].js'),
        publicPath: config.build.assetsPublicPath,
    },
    plugins: [
        // http://vuejs.github.io/vue-loader/en/workflow/production.html
        new webpack.DefinePlugin({
            'process.env': config.build.env,
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
            },
            sourceMap: true,
        }),
        // extract css into its own file
        new ExtractTextPlugin({
            filename: assetsPath('css/[name].[contenthash].css'),
        }),
        // Compress extracted CSS. We are using this plugin so that possible
        // duplicated CSS from different components can be deduped.
        new OptimizeCSSPlugin({
            cssProcessorOptions: {
                safe: true,
            },
        }),
        // generate dist index.html with correct asset hash for caching.
        // you can customize output by editing /index.html
        // see https://github.com/ampedandwired/html-webpack-plugin
        new HtmlWebpackPlugin({
            filename: config.build.index,
            template: 'index.html',
            inject: true,
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true,
                // more options:
                // https://github.com/kangax/html-minifier#options-quick-reference
            },
            // necessary to consistently work with multiple chunks via CommonsChunkPlugin
            chunksSortMode: 'dependency',
        }),
        // split vendor js into its own file
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            // any required modules inside node_modules are extracted to vendor
            minChunks: (module, count) => // eslint-disable-line no-unused-vars
                module.resource &&
                /\.js$/.test(module.resource) &&
                module.resource.indexOf(path.join(__dirname, '../node_modules')) === 0,
        }),
        // extract webpack runtime and module manifest to its own file in order to
        // prevent vendor hash from being updated whenever app bundle is updated
        new webpack.optimize.CommonsChunkPlugin({
            name: 'manifest',
            chunks: ['vendor'],
        }),
        // copy custom static assets
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, '../static'),
                to: config.build.assetsSubDirectory,
                ignore: ['.*'],
            },
        ]),
        ...(config.build.productionGzip
            ? [new CompressionWebpackPlugin({
                asset: '[path].gz[query]',
                algorithm: 'gzip',
                test: new RegExp(`\\.(${config.build.productionGzipExtensions.join('|')})$`),
                threshold: 10240,
                minRatio: 0.8,
            })]
            : []
        ),
        ...(config.build.bundleAnalyzerReport
            ? [new BundleAnalyzerPlugin()]
            : []
        ),
    ],
});
