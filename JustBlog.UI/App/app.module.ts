/**
 * Main module for the JustBlog angular application
 * 
 * @author Brian Mikinski - TomMikinley on GitHub
 * @version 1.0
 * @see README.md for more information on building, testing and the project in general
 */
import {CoreModule} from './Core/core.module';
import {AdminModule} from './Admin/admin.module';
import {BlogModule} from './Blog/blog.module';
import {LayoutModule} from './Layout/layout.module';
import {NotificationModule} from './Notification/notification.module';

// hackish fix for getting around global module definitions
// local module definitions
import * as __angular from "../node_modules/@types/angular";

declare global {
    const angular: typeof __angular;
}

let App:ng.IModule = angular.module('app', [

        /*Main modules*/
        "app.core",
        "app.layout",
        "app.notification",

        ///*Feature modules*/
        "app.admin",
        "app.blog"
]);

//App.run(function ( $uiRouter: ng.ui.IUrlRouterProvider) {
//    window['ui-router-visualizer'].visualizer($uiRouter);
//});

// export the default app modules so that we can reference it in unit tests
export default App;