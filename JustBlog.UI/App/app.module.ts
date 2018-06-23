//import * as angular from "angular";
import { module } from 'angular';
import { AdminModule } from './admin/admin.module';
import { BlogModule } from './blog/blog.module';
import { CoreModule } from './core/core.module';
import { NotificationModule } from './notification/notification.module';
import { LayoutModule } from './Layout/layout.module';

let core = CoreModule;
let admin = AdminModule;
let blog = BlogModule;
let notificaiton = NotificationModule;
let layout = LayoutModule;

let App: ng.IModule = module('app', [

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