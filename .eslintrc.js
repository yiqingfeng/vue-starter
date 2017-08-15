// http://eslint.org/docs/user-guide/configuring
import { baseConfig } from './tools/webpack.config';

module.exports = {
    root: true,
    parser: 'babel-eslint',
    parserOptions: {
        sourceType: 'module'
    },
    env: {
        browser: true,
    },
    extends: 'airbnb-base',
    // required to lint *.vue files
    plugins: [
        'html'
    ],
    // check if imports actually resolve
    'settings': {
        'import/resolver': {
            'webpack': {
                'config': baseConfig
            }
        }
    },
    // add your custom rules here
    'rules': {
        // don't require .vue extension when importing
        'import/extensions': ['error', 'always', {
            'js': 'never',
            'vue': 'never'
        }],
        'indent': ["error", 4],
        'import/prefer-default-export': 0,
        'no-console': [
            'error',
            {
                allow: ['warn', 'error', 'info'],
            },
        ],
        // allow optionalDependencies
        'import/no-extraneous-dependencies': ['error', {
            'optionalDependencies': ['test/unit/index.js']
        }],
        // allow debugger during development
        'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
    }
}
