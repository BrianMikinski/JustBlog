import * as angular from "Angular";
import { AdminModule } from './Admin/admin.module';
import { BlogModule } from './Blog/blog.module';
import { CoreModule } from './Core/core.module';
import { NotificationModule } from './Notification/notification.module';

let core = CoreModule;
let admin = AdminModule;
let blog = BlogModule;
let notificaiton = NotificationModule;

let App: ng.IModule = angular.module('app', [

    "app.core",
    //"app.layout",
    //"app.notification",

    /////*Feature modules*/
    //"app.admin",
    //"app.blog"
]);

//App.run(function ( $uiRouter: ng.ui.IUrlRouterProvider) {
//    window['ui-router-visualizer'].visualizer($uiRouter);
//});

// export the default app modules so that we can reference it in unit tests
export default App;