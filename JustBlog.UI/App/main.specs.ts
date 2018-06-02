var allTestFiles: any = [];
var TEST_REGEXP: any = /(spec|test)\.js$/i;

var pathToModule: any = function (path: any): any {
    return path.replace(/^\/base\//, "").replace(/\.js$/, "");
};

Object.keys((<any>window).__karma__.files).forEach(function (file): void {
    if (TEST_REGEXP.test(file)) {
        // normalize paths to RequireJS module names.
        allTestFiles.push(pathToModule(file));
    }
});

// configuring the AMD requirejs module loader
requirejs.config({
    baseUrl: "/base", //Base Url where you can find all angular modules this is almost always at /base for a requirejs + jasmine app
    paths: {
        appModule: "app.module",
        coreModule: "Core/core.module",
        adminModule: "Admin/admin.module",
        layoutModule: "Layout/layout.module",
        notificationModule: "Notification/notification.module",
        blogModule: "Blog/blog.module"
    },
    // dynamically load all test files
    deps: allTestFiles,

    // we have to kickoff jasmine, as it is asynchronous
    callback: (<any>window).__karma__.start
});