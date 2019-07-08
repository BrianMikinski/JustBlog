import { BaseModule } from "core/models/BaseModule";
import { NavBarComponent, NavBarComponentName } from "layout/navBar/navbar.component";
import { ShellComponent, ShellComponentName } from "layout/shell/shell.component";
import * as angular from "angular";
import * as uirouter from "@uirouter/angularjs"


const moduleName: string = 'app.layout';
export default moduleName;

/**
 * Create a shell controller for our application
 */
export class LayoutModule extends BaseModule {

    constructor() {
        super();

        this.moduleName = moduleName;
        this.moduleDependencies = [uirouter.default, 'app.core'];

        this.app = angular.module(this.moduleName, this.moduleDependencies);

        this.app.config(this.locationProviderConfig);
    }

    /**
     * Configure the location provider to be in html5 mode
     * @param $locationProvider
     */
    private locationProviderConfig($locationProvider: ng.ILocationProvider): void {
        $locationProvider.html5Mode(true);
    };
}

let layoutModule = new LayoutModule();

layoutModule.AddComponent(NavBarComponentName, new NavBarComponent());
layoutModule.AddComponent(ShellComponentName, new ShellComponent());