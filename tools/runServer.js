/**
 * @desc Launches a development web server with "live reload" functionality
 */
import path from 'path';
import express from 'express';
import webpack from 'webpack';
import opn from 'opn';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import proxyMiddleware from 'http-proxy-middleware';
import historyCallback from 'connect-history-api-fallback';
import config from '../config';
import devConfig from './webpack.config.dev';

async function runServer() {
    // default port where dev server listens for incoming traffic
    const port = process.env.PORT || config.dev.port;
    const uri = `http://localhost:${port}`;
    // automatically open browser, if not set will be false
    const autoOpenBrowser = !!config.dev.autoOpenBrowser;
    const proxyTable = config.dev.proxyTable;

    const app = express();
    const compiler = webpack(devConfig);
    const devMiddleware = webpackDevMiddleware(compiler, {
        publicPath: devConfig.output.publicPath,
        quiet: true,
    });
    const hotMiddleware = webpackHotMiddleware(compiler, {
        log: false,
        heartbeat: 2000,
    });
    // force page reload when html-webpack-plugin template changes
    compiler.plugin('compilation', (compilation) => {
        compilation.plugin('html-webpack-plugin-after-emit', (data, cb) => {
            hotMiddleware.publish({ action: 'reload' });
            cb();
        });
    });
    // proxy api requests
    Object.keys(proxyTable).forEach((context) => {
        let options = proxyTable[context];
        if (typeof options === 'string') {
            options = { target: options };
        }
        app.use(proxyMiddleware(options.filter || context, options));
    });
    // plugin use
    app.use(historyCallback()); // handle fallback for HTML5 history API
    app.use(devMiddleware); // serve webpack bundle output
    app.use(hotMiddleware); // enable hot-reload and state-preserving
    // serve pure static assets
    const staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory);
    app.use(staticPath, express.static('./static'));

    // executes the callback if the bundle is valid or after it is valid again
    let bundleCallback;
    const readyPromise = new Promise((resolve) => {
        bundleCallback = resolve;
    });
    const server = app.listen(port);

    console.info('> Starting dev server...');
    devMiddleware.waitUntilValid(() => {
        console.info(`> Listening at ${uri}\n`);
        // when env is testing, don't need open it
        if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
            opn(uri);
        }
        bundleCallback({
            close() {
                server.close();
            },
        });
    });

    return readyPromise;
}

export default runServer;
