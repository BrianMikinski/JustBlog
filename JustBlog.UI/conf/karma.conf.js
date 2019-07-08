const webpackConfig = require('../webpack.test.js');

module.exports = function (config) {
    const configuration = {
        basePath: "../app/", // this is the default path where you are able to find all spec files
        logLevel: "DEBUG",
        browserNoActivityTimeout: 10000,

        plugins: ["karma-phantomjs-launcher", 
            "karma-jasmine",
            "karma-junit-reporter",
            "karma-coverage",
            "karma-chrome-launcher",
            "karma-firefox-launcher",
            "karma-edge-launcher",
            "karma-ie-launcher",
            'karma-ng-html2js-preprocessor',
            'karma-webpack'],

        frameworks: ["jasmine"],
        files: [
            '../node_modules/angular-mocks/angular-mocks.js',
            { pattern: '**/*.spec.ts', watched: false }],

        browsers: [
             "PhantomJS", //PhantomJS does not support es6 syntax. Support is planned for release 2.5
             "Chrome",
             //"Edge",
             //"IE", // IE does not fully support ecmascript 5 syntax
        ],

        reporters: [
          "progress",
          "junit"
        ],

        junitReporter: {
            outputDir: "../testResults/JunitReports",
            outputFile: "test-results.xml",
            userBrowserName: true
        },

        // required for js test coverage
        preprocessors: {
            '../app/**/*.spec.ts': ['webpack'],
            '../wwwrootTest/**/*.html': ['ng-html2js']
        },

        webpack: webpackConfig,

        webpackMiddleware: {
            // webpack-dev-middleware configuration
            //stats: 'errors-only'
        },

        ngHtml2JsPreprocessor: {
            stripPrefix: "wwwrootTest",
            moduleName: 'componentTemplates'
        },
        singleRun: false
    };

    config.set(configuration);
};