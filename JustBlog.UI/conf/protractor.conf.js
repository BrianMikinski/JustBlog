// protractor configuration file
exports.config = {
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: ['todo-spec.js'],
    directConnect: true,

    // capabilities to be passed to the webdriver instance.
    capabilities: {
        'browserName': 'chrome'
    },

    // framework to use. Jasmine is recommended.
    framework: 'jasmine',

    // options to be passed to Jasmine.
    jasmineNodeOpts: {
        defaultTimeoutInterval: 30000
    }
};