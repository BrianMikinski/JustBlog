import { default as uirouter } from "@uirouter/angularjs";
import * as angular from "angular";
import { BaseModule } from "core/models/BaseModule";
import { GanttComponent, GanttComponentName } from "gantt/gantt.component";
import { AGGridComponent, agGridComponentName } from "./agGrid.component";

const moduleName = 'app.gantt';
export default moduleName;

/**
 * Create a shell controller for our application
 */
export class GanttModule extends BaseModule {

    constructor() {
        super();

        this.moduleName = moduleName;
        this.moduleDependencies = [uirouter, 'app.core'];

        this.app = angular.module(this.moduleName, this.moduleDependencies);

        this.app.config(this.locationProviderConfig);

        this.app.config(this.uiStateConfig);
    }

    private uiStateConfig($stateProvider: ng.ui.IStateProvider, $urlRouterProvider: ng.ui.IUrlRouterProvider): void {

        const ganttState: ng.ui.IState = {
            name: "gantt",
            component: GanttComponentName,
            url: "/gantt"
        };

        const agGridState: ng.ui.IState = {
            name: "aggrid",
            component: agGridComponentName,
            url: "/aggrid"
        };

        // order matters! Routes will not fall through unless specified
        $stateProvider.state(ganttState);
        $stateProvider.state(agGridState);
    }

    /**
     * Configure the location provider to be in html5 mode
     * @param $locationProvider
     */
    private locationProviderConfig($locationProvider: ng.ILocationProvider): void {
        $locationProvider.html5Mode(true);
    };
}

const ganttModule = new GanttModule();

ganttModule.AddComponent(GanttComponentName, new GanttComponent());
ganttModule.AddComponent(agGridComponentName, new AGGridComponent());