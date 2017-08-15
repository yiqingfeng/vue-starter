/**
 * @desc webpack vue-laoders
 */
import { cssLoaders } from './utils';
import config from '../config';

const ISDEBUG = process.env.NODE_ENV !== 'production';

export default {
    loaders: cssLoaders({
        sourceMap: !ISDEBUG
            ? config.build.productionSourceMap
            : config.dev.cssSourceMap,
        extract: !ISDEBUG,
    }),
    transformToRequire: {
        video: 'src',
        source: 'src',
        img: 'src',
        image: 'xlink:href',
    },
};
