/**
 * @desc project util methods
 */
import path from 'path';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import config from '../config';

const ISDEBUG = process.env.NODE_ENV !== 'production';

export function assetsPath(_path) {
    const assetsSubDirectory = ISDEBUG
        ? config.dev.assetsSubDirectory
        : config.build.assetsSubDirectory;
    return path.posix.join(assetsSubDirectory, _path);
}

export function cssLoaders(options) {
    const opts = options || {};
    const cssLoader = {
        loader: 'css-loader',
        options: {
            minimize: !ISDEBUG,
            sourceMap: opts.sourceMap,
        },
    };

    // generate loader string to be used with extract text plugin
    function generateLoaders(loader, loaderOptions) {
        const loaders = [cssLoader];
        if (loader) {
            loaders.push({
                loader: `${loader}-loader`,
                options: Object.assign({}, loaderOptions, {
                    sourceMap: opts.sourceMap,
                }),
            });
        }

        // Extract CSS when that option is specified
        // (which is the case during production build)
        if (options.extract) {
            return ExtractTextPlugin.extract({
                use: loaders,
                fallback: 'vue-style-loader',
            });
        }
        return ['vue-style-loader'].concat(loaders);
    }

    // https://vue-loader.vuejs.org/en/configurations/extract-css.html
    return {
        css: generateLoaders(),
        postcss: generateLoaders(),
        less: generateLoaders('less'),
        sass: generateLoaders('sass', { indentedSyntax: true }),
        scss: generateLoaders('sass'),
        stylus: generateLoaders('stylus'),
        styl: generateLoaders('stylus'),
    };
}

// Generate loaders for standalone style files (outside of .vue)
export function styleLoaders(options) {
    const output = [];
    const loaders = cssLoaders(options);
    Object.keys(loaders).forEach((extension) => {
        output.push({
            test: new RegExp(`\\.${extension}$`),
            use: loaders[extension],
        });
    });
    return output;
}
