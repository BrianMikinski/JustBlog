import * as uirouter from "@uirouter/angularjs";
import { module } from 'angular';
import { default as adminModule } from './admin/admin.module';
import { default as blogModule } from './blog/blog.module';
import { default as coreModule } from './core/core.module';
import { default as notificationModule } from './notification/notification.module';
import { default as layoutModule } from './Layout/layout.module';

let App: ng.IModule = module('app', [

    uirouter.default,
    coreModule,
    layoutModule,
    notificationModule,

    ///*Feature modules*/
    adminModule,
    blogModule
]);

//App.run(function ( $uiRouter: ng.ui.IUrlRouterProvider) {
//    window['ui-router-visualizer'].visualizer($uiRouter);
//});

// export the default app modules so that we can reference it in unit tests
export default App;