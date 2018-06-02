/**
 * gulp.js task configuration file for the karma test runner
 */
module.exports = function (config) {
    const configuration = {
        basePath: "../wwwrootTest/", // this is the default path where you are able to find all spec files
        logLevel: "DEBUG", //use "DEBUG" for troubleshooting
        browserNoActivityTimeout: 10000,

        plugins: [
            "karma-phantomjs-launcher",
            "karma-jasmine",
            "karma-junit-reporter",
            "karma-coverage",
            "karma-chrome-launcher",
            "karma-firefox-launcher",
            "karma-edge-launcher",
            "karma-ie-launcher",
            'karma-ng-html2js-preprocessor'],

        frameworks: [
          "jasmine"], //Do not use karma-requirejs plugin framework

        // When using a module loader such as requirejs, the order of the files matters.
        // You also must be certain to only include a file once - i.e.
        // you cannot load a module using requirejs as well as include
        // it using the pattern matcher or specifically specified.
        files: [

          // do not use minified versions of libraries here. They will fail!
          "vendor/scripts/jquery.js",
          "vendor/scripts/angular.js",
          "vendor/scripts/angular-route.js",
          "vendor/scripts/angular-mocks.js",
          "vendor/scripts/angular-sanitize.js",
          "vendor/scripts/angular-animate.js",
          "vendor/scripts/angular-ui-router.js",
          "vendor/scripts/ui-bootstrap-tpls.js",
          "vendor/scripts/bootstrap.js",
          "vendor/scripts/toastr.js",
          "vendor/scripts/tinymce.js",
          "vendor/scripts/angularMCE/tinymce.js",
          "vendor/scripts/require.js",
            '../node_modules/karma-requirejs/lib/adapter.js',
            "**/*.html", // include html for component testing
          "vendor/css/*.css",
          { pattern: "*.js", included: false },
          { pattern: "**/*.js", included: false },
          { pattern: "**/*.spec.js", included: false },
          { pattern: "**/*.js.map", included: false },
          "main.specs.js"], // requirejs main file.

        exclude: [
          "main.js" // always exclude the app main.js
        ],

        browsers: [
             "PhantomJS", //PhantomJS does not support es6 syntax. Support is planned for release 2.5
             "Chrome",
             //"Edge",
             //"IE", // IE does not fully support ecmascript 5 syntax
        ],

        reporters: [
          "progress",
          "junit", // Unit tests results that can be read by VSTS tooling
            //"coverage"
        ],

        junitReporter: {
            outputDir: "../testResults/JunitReports",
            outputFile: "test-results.xml",
            userBrowserName: true
        },

        // required for js test coverage
        preprocessors: {
            "vendor/**/!(*.js|*.css|*.eot|*.svg|*.woff|*.woff2|*.tff)": ["coverage"], //ignore non js files. Potentially broken
            "*.js": ['coverage'],
            "Admin/**/*.js": ['coverage'],
            "Blog/**/*.js": ['coverage'],
            "Core/**/*.js": ['coverage'],
            "Layout/**/*.js": ['coverage'],
            "Notification/**/*.js": ['coverage'],
            '**/*.html': ['ng-html2js']
        },
        ngHtml2JsPreprocessor: {
            stripPrefix: "wwwrootTest",
            moduleName: 'componentTemplates'
        },

        coverageReporter: {
            type: "html",
            dir: "../testResults/Coverage"
        },

        singleRun: false,
    };

    config.set(configuration);
};