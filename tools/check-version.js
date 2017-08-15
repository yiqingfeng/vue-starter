/**
 * @desc check npm & node version
 */
import chalk from 'chalk';
import semver from 'semver';
import shell from 'shelljs';
import packageConfig from '../package.json';

function exec(cmd) {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    return require('child_process').execSync(cmd).toString().trim();
}

const versionRequirements = [
    {
        name: 'node',
        currentVersion: semver.clean(process.version),
        versionRequirement: packageConfig.engines.node,
    },
];

if (shell.which('npm')) {
    versionRequirements.push({
        name: 'npm',
        currentVersion: exec('npm --version'),
        versionRequirement: packageConfig.engines.npm,
    });
}

async function checkVersion() {
    const warnings = [];
    versionRequirements.forEach((mod) => {
        if (!semver.satisfies(mod.currentVersion, mod.versionRequirement)) {
            warnings.push(`${mod.name}: ${chalk.red(mod.currentVersion)} should be ${chalk.green(mod.versionRequirement)}`);
        }
    });

    if (warnings.length) {
        console.warn('');
        console.warn(chalk.yellow('To use this template, you must update following to modules:'));
        console.warn();
        warnings.forEach((warning) => {
            console.error(`  ${warning}`);
        });
        console.warn();
        process.exit(1);
    }
}

export default checkVersion;
