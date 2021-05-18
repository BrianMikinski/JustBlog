'use strict';

module.exports = (env, argv) => {

    switch (env.build) {
        case "prod":
            return require('./webpack.prod.js')
        case "dev":
            return require(`./webpack.dev.js`);
        default:
            console.log("Error: parameter build could not be found");
            break;
    }
};