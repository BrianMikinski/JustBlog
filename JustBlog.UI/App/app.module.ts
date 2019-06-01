import * as uirouter from "@uirouter/angularjs";
import { module } from 'angular';
import { default as adminModule } from './admin/admin.module';
import { default as blogModule } from './blog/blog.module';
import { default as coreModule } from './core/core.module';
import { default as notificationModule } from './notification/notification.module';
import { default as layoutModule } from './layout/layout.module';
import 'bootstrap/dist/css/bootstrap.css';
import 'toastr/build/toastr.min.css'
import 'font-awesome/css/font-awesome.min.css';
import 'angular-ui-bootstrap/dist/ui-bootstrap-csp.css';

// include our CSS
require("./index.html");
require("./content/css/style.css");
require("./content/css/ng-animate.css");

declare module 'angular' {

    export namespace ui {
          interface IState {
              action?: string | undefined;
              resource?: string | undefined;

              /**
               * If no authorization resolve is set, then the default auth resolve
               * will be added in the core.module. This can be overrideen by
               * setting a resolve on the route if need be. 
               */
              authorizationResolver?: any | undefined;
              protected?: boolean | undefined;
        }
    }
}

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

// hack for hot web pack hot module replacement
if ((module as any).hot) {
    (module as any).hot.accept()
}