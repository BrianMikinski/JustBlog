/// <binding BeforeBuild='clean:All, build:All' Clean='clean:All' ProjectOpened='watch:TypeScript' />

/*
* main entry point for gulp.js
*/
'use strict'

/**
 * load required npm packages
 */
let gulp = require("gulp");
let ts = require("gulp-typescript");
let sourceMaps = require("gulp-sourcemaps");
let del = require("del");
let karmaServer = require("karma").Server;
let eventStream = require("event-stream");
let gutil = require('gulp-util');

/**
 *  configure paths
 * */
var paths = {
    scripts: {
        compile: {
            input: "App/**/*.ts",
            output: "wwwroot/",
            config: "tsconfig.json",
            tests: "App/**/*.spec.ts"
        },
        test: {
            output: "wwwrootTest/",
            requireJSMainSpec: "App/main.specs.ts"
        },
        vendor: {
            inputMinified: {
                jquery: "node_modules/jquery/dist/jquery.min.js",
                angular: "node_modules/angular/angular.min.js",
                angularRoute: "node_modules/angular-route/angular-route.min.js",
                angularAnimate: "node_modules/angular-animate/angular-animate.min.js",
                angularSanitize: "node_modules/angular-sanitize/angular-sanitize.min.js",
                angularUIRouter: "node_modules/@uirouter/angularjs/release/angular-ui-router.min.js",
                bootstrap: "node_modules/bootstrap/dist/js/bootstrap.min.js",
                angularUI: "node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js", // no minified version of this exists
                toastr: "node_modules/toastr/build/toastr.min.js",
                require: "node_modules/requirejs/require.js",
                tinymce: "node_modules/tinymce/tinymce.min.js",
                tinymcePlugins: "node_modules/tinymce/plugins/",
                tinyMCETheme: "node_modules/tinymce/themes/modern/theme.min.js",
                ngtinymce: "node_modules/angular-ui-tinymce/dist/tinymce.min.js"
            },
            input: {
                jquery: "node_modules/jquery/dist/jquery.js",
                angular: "node_modules/angular/angular.js",
                angularRoute: "node_modules/angular-route/angular-route.js",
                angularMock: "node_modules/angular-mocks/angular-mocks.js",
                angularAnimate: "node_modules/angular-animate/angular-animate.js",
                angularSanitize: "node_modules/angular-sanitize/angular-sanitize.js",
                angularUIRouter: "node_modules/@uirouter/angularjs/release/angular-ui-router.js",
                bootstrap: "node_modules/bootstrap/dist/js/bootstrap.js",
                angularUI: "node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js",
                toastr: "node_modules/toastr/toastr.js",
                require: "node_modules/requirejs/require.js",
                tinymce: "node_modules/tinymce/tinymce.js",
                tinymcePlugins: "node_modules/tinymce/plugins/",
                tinymcePluginsIgnore: "node_modules/tinymce/plugins/!**/*.min.js",
                tinyMCETheme: "node_modules/tinymce/themes/modern/theme.js",
                ngtinymce: "node_modules/angular-ui-tinymce/src/tinymce.js"
            },
            wwwRootOutput: "wwwroot/vendor/scripts",

            wwwRootTestOutput: "wwwrootTest/vendor/scripts"
        },
    },
    html: "./App/**/*.html",
    content: {
        input: "Content/profile.jpg",
        wwwrootOutput: "wwwroot/Content",
        wwwrootTestOutput: "wwwrootTest/Content"
    },
    css: {
        styles: "Content/*.css",
        vendor: {
            bootstrap: "node_modules/bootstrap/dist/css/bootstrap.min.css",
            bootstrapAngular: "node_modules/angular-ui-bootstrap/dist/ui-bootstrap-csp.css",
            fontAwesome: "node_modules/font-awesome/css/font-awesome.min.css",
            toastr: "node_modules/toastr/build/toastr.min.css"
        },
        wwwrootOutput: "wwwroot/vendor/css",

        wwwrootTestOutput: "wwwrootTest/vendor/css"
    },
    fonts: {
        input: {
            fontAwesome: "node_modules/font-awesome/fonts/fontawesome-webfont*",
            fontawesomeOTF: "node_modules/font-awesome/fonts/FontAwesome.otf",
            bootstrap: "node_modules/bootstrap/fonts/glyphicons-halflings-regular.*"
        },
        wwwrootOutput: "wwwroot/vendor/fonts/",
        wwwrootTestOutput: "wwwrootTest/vendor/fonts/",

    },
    karma: "./conf/karma.conf.js",
    tests: {
        results: "testResults"
    },
    tinyMCE: {
        skinsInput: "node_modules/tinymce/skins/",
        codeSampePlugin: "node_modules/tinymce/plugins/codesample/css/",
        wwwrootOutput: "wwwroot/vendor/scripts/angularMCE/",
        wwwrootTestOutput: "wwwrootTest/vendor/scripts/angularMCE"
    }
};


/**
 * setup the Gulp TypeScript Compilation
 */
var tsProject = ts.createProject(paths.scripts.compile.config, {
    typescript: require("typescript")
});

/**
 * clean everything from distribution and tests folders
 */
gulp.task("clean:All", function () {
    return del([paths.scripts.compile.output + "**/*",
    paths.scripts.test.output + "**/*",
    paths.tests.results + "**/*"]);
});

/**
 * All of these copy tasks need to be refactored. This is not done correctly nor sanely...
 */

/**
 * Copy pictures and other content to the app base
 */
gulp.task("build:copyContent", function () {
    return gulp.src([paths.content.input])
        .pipe(gulp.dest(paths.content.wwwrootOutput))
        .pipe(gulp.dest(paths.content.wwwrootTestOutput));
})

/**
 * copy HTML files to distribution and test folders
 */
gulp.task("build:copyHTML", function () {
    return gulp.src(paths.html)
        .pipe(gulp.dest(paths.scripts.compile.output))
        .pipe(gulp.dest(paths.scripts.test.output));
});

/**
 * copy vendor css
 */
gulp.task("build:copyVendorCSS", function () {
    return gulp.src([
        paths.css.styles,
        paths.css.vendor.bootstrap,
        paths.css.vendor.bootstrapAngular,
        paths.css.vendor.fontAwesome,
        paths.css.vendor.toastr])
        .pipe(gulp.dest(paths.css.wwwrootOutput))
        .pipe(gulp.dest(paths.css.wwwrootTestOutput));
});

/**
 * copy fonts for the build
 */
gulp.task("build:copyFonts", function () {
    return gulp.src([paths.fonts.input.fontAwesome,
    paths.fonts.input.fontawesomeOTF,
    paths.fonts.input.bootstrap])
        .pipe(gulp.dest(paths.fonts.wwwrootOutput))
        .pipe(gulp.dest(paths.fonts.wwwrootTestOutput));
})

/*
 * build css
 */
gulp.task("build:CSS_Not_Implemented", function () {
    throw new Error("NotImplemented");
});

/**
 * Copy the code sample plugin css for tiny mce
 */
gulp.task("build:copyTinyMceCodeSampleCssTest", function () {
    return gulp.src([paths.tinyMCE.codeSampePlugin + "*.css"])
        .pipe(gulp.dest(paths.scripts.vendor.wwwRootTestOutput + "/plugins/codesample/css"));
});

/**
 * Copy the code sample plugin css for tiny mce
 */
gulp.task("build:copyTinyMceCodeSampleCss", function () {
    return gulp.src([paths.tinyMCE.codeSampePlugin + "*.css"])
        .pipe(gulp.dest(paths.scripts.vendor.wwwRootOutput + "/plugins/codesample/css"));
});

/**
 * Copy Tiny MCE Skins Test
 */
gulp.task("build:copyTinyMCESkinsTest", function () {
    return gulp.src([paths.tinyMCE.skinsInput + "**/*"])
        .pipe(gulp.dest(paths.scripts.vendor.wwwRootTestOutput + "/skins"));
});

/**
 * Copy Tiny MCE Skins
 */
gulp.task("build:copyTinyMCESkins", function () {
    return gulp.src([paths.tinyMCE.skinsInput + "**/*"])
        .pipe(gulp.dest(paths.scripts.vendor.wwwRootOutput + "/skins"));
});

/**
 * Copy the tiny MCE Themes
 */
gulp.task("build:copyTinyMCEThemes", function () {
    return gulp.src([paths.scripts.vendor.inputMinified.tinyMCETheme])
        .pipe(gulp.dest(paths.scripts.vendor.wwwRootOutput + "/themes/modern"));
});

/**
 * Copy the tiny MCE Themes Test
 */
gulp.task("build:copyTinyMCEThemesTest", function () {
    return gulp.src([paths.scripts.vendor.input.tinyMCETheme])
        .pipe(gulp.dest(paths.scripts.vendor.wwwRootTestOutput + "/themes/modern"));
});

/**
 * Copy tiny mce plugins
 */
gulp.task("build:copyTinyMCETestPlugins", function () {
    return gulp.src([paths.scripts.vendor.input.tinymcePluginsIgnore,
    paths.scripts.vendor.input.tinymcePlugins + "**/*.js"])
        .pipe(gulp.dest(paths.scripts.vendor.wwwRootOutput + "/plugins"));
})

/**
 * Copy tiny mce plugins to wwwrootTest
 */
gulp.task("build:copyTinyMCEPlugins", function () {
    return gulp.src([paths.scripts.vendor.inputMinified.tinymcePlugins + "**/*.min.js"])
        .pipe(gulp.dest(paths.scripts.vendor.wwwRootTestOutput + "/plugins"));
})

/**
 * Copy tiny mce angular 
 */
gulp.task("build:copyTinyMCE", ["build:copyTinyMCEPlugins", "build:copyTinyMceCodeSampleCss", "build:copyTinyMCEThemes", "build:copyTinyMCESkins"], function () {
    return gulp.src([paths.scripts.vendor.inputMinified.ngtinymce])
        .pipe(gulp.dest(paths.tinyMCE.wwwrootOutput));
})

/**
 * Copy tiny mce angular file to the test folder
 */
gulp.task("build:copyTinyMCETests", ["build:copyTinyMCETestPlugins", "build:copyTinyMceCodeSampleCssTest", "build:copyTinyMCEThemesTest", "build:copyTinyMCESkinsTest"], function () {
    return gulp.src([paths.scripts.vendor.input.ngtinymce])
        .pipe(gulp.dest(paths.tinyMCE.wwwrootTestOutput));
})

/**
 * copy vendor script libraries to root and test folders
 */
gulp.task("build:copyVendorScripts", ["build:copyTinyMCE"], function () {
    return gulp.src([
        paths.scripts.vendor.inputMinified.angular,
        paths.scripts.vendor.inputMinified.angularAnimate,
        paths.scripts.vendor.inputMinified.angularRoute,
        paths.scripts.vendor.inputMinified.angularSanitize,
        paths.scripts.vendor.inputMinified.angularUI,
        paths.scripts.vendor.inputMinified.angularUIRouter,
        paths.scripts.vendor.inputMinified.bootstrap,
        paths.scripts.vendor.inputMinified.jquery,
        paths.scripts.vendor.inputMinified.toastr,
        paths.scripts.vendor.inputMinified.tinymce,
        paths.scripts.vendor.inputMinified.require])
        .pipe(gulp.dest(paths.scripts.vendor.wwwRootOutput))
});

/*
 * Copy all vendor scripts
 */
gulp.task("build:copyVendorScriptsTest", ["build:copyTinyMCETests"], function () {
    return gulp.src([
        paths.scripts.vendor.input.angular,
        paths.scripts.vendor.input.angularAnimate,
        paths.scripts.vendor.input.angularRoute,
        paths.scripts.vendor.input.angularSanitize,
        paths.scripts.vendor.input.angularUI,
        paths.scripts.vendor.input.angularUIRouter,
        paths.scripts.vendor.input.angularMock,
        paths.scripts.vendor.input.bootstrap,
        paths.scripts.vendor.input.jquery,
        paths.scripts.vendor.input.toastr,
        paths.scripts.vendor.input.tinymce,
        paths.scripts.vendor.input.require])
        .pipe(gulp.dest(paths.scripts.vendor.wwwRootTestOutput));
});

/**
 * compile TypeScript
 */
gulp.task("build:compileTypeScript", ["build:compileTypeScriptTests",
    "build:copyVendorScripts",
    "build:copyVendorScriptsTest"], function () {

        return gulp.src([paths.scripts.compile.input,
        "!" + paths.scripts.compile.tests, // ignore test files
        "!" + paths.scripts.test.requireJSMainSpec]) // ignore jasmine main.spec.js
            .pipe(sourceMaps.init())
            .pipe(tsProject())
            .js
            .pipe(sourceMaps.write("."))
            .pipe(gulp.dest(paths.scripts.compile.output));
    });

/**
 * compile TypeScript for tests
 */
gulp.task("build:compileTypeScriptTests", ["build:copyVendorScriptsTest"], function () {

    return gulp.src(paths.scripts.compile.input)
        .pipe(sourceMaps.init())
        .pipe(tsProject())
        .on('error', onError)
        .js
        .pipe(sourceMaps.write("."))
        .pipe(gulp.dest(paths.scripts.test.output));
});

/**
 * build All
 */
gulp.task("build:All", ["build:copyVendorCSS",
    "build:copyHTML",
    "build:compileTypeScript",
    "build:copyFonts",
    "build:copyContent"], function () { });

/**
 * run test once and exit
 */
gulp.task("unitTests:TypeScript", ["build:compileTypeScriptTests"], function (done) {

    new karmaServer({
        configFile: __dirname + "/conf/karma.conf.js",
        singleRun: true
    }, function (exitCode) {
        /**
         * karma returns an exitCode == 1 if there were failing tests
         * otherwise it returns 0 which allows gulp to successfully pass.
         */ 
        console.log(exitCode);
        done(exitCode);
        }).start();

    new karmaServer({})
});

/**
 * Add a watch to compile scripts
*/
gulp.task("watch:TypeScript", function () {

    // turn off fatal error if we are in watch
    fatalLevel = fatalLevel || 'off';
    gulp.watch(paths.scripts.compile.input, ["build:compileTypeScript"]); // no callback
});


/**
 * Error handling
 */

// Command line option:
//  --fatal=[warning|error|off]
let fatalLevel = require('yargs').argv.fatal;

let ERROR_LEVELS = ['error', 'warning'];

/**
 * Determine if the error is a fatal error or not. In continuous integration builds we want
 * this to blow up our build.
 * @param {any} level
 */
function isFatal(level) {
    return ERROR_LEVELS.indexOf(level) <= ERROR_LEVELS.indexOf(fatalLevel || 'error');
}

/**
 * Task error handler
 * @param {any} level
 * @param {any} error
 */
function handleError(level, error) {
    gutil.log(error.message);
    if (isFatal(level)) {
        process.exit(1);
    }
}

/**
 * Convenience handler for error-level errors.
 * @param {any} error
 */
function onError(error) {
    handleError.call(this, 'error', error);
}

/**
 * Convenience handler for warning-level errors.
 * @param {any} error
 */
function onWarning(error) {
    handleError.call(this, 'warning', error);
}