import { NavBarComponentName, NavBarComponent } from "Layout/NavBar/navbar.component";
import { NavigationController } from "Layout/navigation.controller"
import { ShellComponentName, ShellComponent } from "Layout/Shell/shell.component";
import { ShellController } from "Layout/shell.controller";
import { BaseModule } from "Core/Models/BaseModule";
import * as angular from "Angular";

/**
 * Create a shell controller for our application
 */
export class LayoutModule extends BaseModule {

    constructor() {
        super();

        this.moduleName = 'app.layout';
        this.moduleDependencies = ['ngRoute', 'app.core'];

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

layoutModule.AddController('Navigation', NavigationController as ng.Injectable<angular.IControllerConstructor>);
layoutModule.AddController("Shell", ShellController as ng.Injectable<angular.IControllerConstructor>);

layoutModule.AddComponent(NavBarComponentName, new NavBarComponent());
layoutModule.AddComponent(ShellComponentName, new ShellComponent());