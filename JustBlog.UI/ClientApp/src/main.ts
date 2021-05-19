import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

export function getBaseUrl() {
  return document.getElementsByTagName('base')[0].href;
}

const providers = [
  { provide: 'BASE_URL', useFactory: getBaseUrl, deps: [] }
];

if (environment.production) {
  enableProdMode();
}

//platformBrowserDynamic(providers).bootstrapModule(AppModule)
//  .catch(err => console.log(err));


//export class AppModule {
//  ngDoBoostrap() {

//  }
//}

//platformBrowserDynamic(providers).bootstrapModule(AppModule)
//  .then(platformRef => {
//    console.log("Boostrapping in hybrid mode with Angular & AngularJS");
//    const upgrade = platformRef.injector.get(UpgradeModule) as UpgradeModule;
//    upgrade.boostrap(document.body, ['']);
//  })
//  .catch(err => console.log(err));

//export class In8PlatformModule {
//  constructor(private upgrade: UpgradeModule) { }

//  ngDoBootstrap() {
//    //Note that you are bootstrapping the AngularJS module from inside ngDoBootstrap. The arguments are the same as you would pass to angular.bootstrap if you were manually bootstrapping AngularJS: the root element of the application; and an array of the AngularJS 1.x modules that you want to load.
//    this.upgrade.bootstrap(document.getElementById('In8Platform2'), ['In8Platform']);

//    console.log("Platform App Bootstrapped");
//  }
//}
