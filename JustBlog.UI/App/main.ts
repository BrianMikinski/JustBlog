
/**
 * RequireJs AMD - Asynchronous Module Definitions. We are basically telling the application
 * how we want it to our required JavaScript. We are kicking off the loading with 
 **/

requirejs.config({
    paths: {
        appModule: "app.module",
        coreModule: "Core/core.module",
        adminModule: "Admin/admin.module",
        layoutModule: "Layout/layout.module",
        notificationModule: "Notification/notification.module",
        blogModule: "Blog/blog.module"
    }
});

requirejs(
    [
        //These must be in the order they need to be loaded!
        "appModule",
        "coreModule",
        "layoutModule",
        "notificationModule",
        "adminModule",
        "blogModule"
    ],

    //Because we are asynchronously loading our dependency modules, we have
    //to bootstrap the application at run time.
    function () {
        angular.bootstrap(document, ["app"]);
    });