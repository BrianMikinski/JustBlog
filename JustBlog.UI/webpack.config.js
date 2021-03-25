'use strict';

module.exports = (env) => {

    if (!env) {
        env = 'dev';
    }

    return require(`./webpack.dev.js`);
};