/**
 * build for the project
 */
import ora from 'ora';
import rm from 'rimraf';
import path from 'path';
import chalk from 'chalk';
import webpack from 'webpack';
import run from './run';
import checkVersion from './check-version';
import config from '../config';
import buildConfig from './webpack.config.prod';

async function build() {
    process.env.NODE_ENV = 'production';

    await run(checkVersion);

    const spinner = ora('building for production...');
    spinner.start();

    rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), (e) => {
        if (e) throw e;
        webpack(buildConfig, (err, stats) => {
            spinner.stop();
            if (err) throw err;
            process.stdout.write(`${stats.toString({
                colors: true,
                modules: false,
                children: false,
                chunks: false,
                chunkModules: false,
            })}\n\n`);

            console.info(chalk.cyan('  Build complete.\n'));
            console.info(chalk.yellow(`
                  Tip: built files are meant to be served over an HTTP server.\n
                  Opening index.html over file:// won't work.\n`));
        });
    });
}

export default build;
