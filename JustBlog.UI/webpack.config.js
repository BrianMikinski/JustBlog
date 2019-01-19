'use strict';

module.exports = (env) => {

    if (!env) {
        env = 'dev';
    }

    return require(`./webpack.${env}.js`)
}