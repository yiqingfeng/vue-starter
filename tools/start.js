/**
 * @desc execute the project for development
 */
import run from './run';
import checkVersion from './check-version';
import runServer from './runServer';
import config from '../config';

/**
 * Launches a development web server with "live reload" functionality
 * synchronizing URLs, interactions and code changes across multiple devices.
 */
async function start() {
    if (!process.env.NODE_ENV) {
        process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV);
    }
    await run(checkVersion);
    await run(runServer);
}

export default start;
