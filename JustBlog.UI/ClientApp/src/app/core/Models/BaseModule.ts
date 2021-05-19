import { Action } from "../authorization/Action";
import { Resource } from "../authorization/Resource";

/**
 * An abstract base class for creating modules
 */
export abstract class BaseModule {
    protected app: ng.IModule;
    protected moduleDependencies: Array<string> = [];
    protected moduleName: string = "";
    protected readonly adminRouteConstants: string = "ADMIN_ROUTE_CONSTANTS";
    protected readonly authEventConstants: string = "AUTH_EVENT_CONSTANTS";

    constructor() { }

    /**
     * Add a new controller
     * @param name
     * @param controller
     */
    AddController(name: string, controller: angular.Injectable<angular.IControllerConstructor>): void {

        this.app.controller(name, controller);
    }

    /**
     * Add a new service
     * @param name
     * @param service
     */
    AddService(name: string, service: Function): void {
        this.app.service(name, service);
    }

    /**
     * Add a new factory
     * @param name
     * @param config
     */
    AddFactory(name: string, config: Function): void {
        this.app.factory(name, config);
    }

    /**
     * Add a value to the module
     * @param name
     * @param value
     */
    AddValue(name: string, value: any): void {
        this.app.value(name, value);
    }

    /**
     * Add a new constant to the module
     * @param name
     * @param constant
     */
    AddConstant(name: string, constant: any): void {
        this.app.constant(name, constant);
    }

    /**
     * Add a directive to the module
     * @param name
     * @param directive
     */
    AddDirective(name: string, directive: any): void {
        this.app.directive(name, directive);
    }

    /**
     * Add a new component to the module
     * @param name
     * @param component
     */
    AddComponent(name: string, component: ng.IComponentOptions): void {
        this.app.component(name, component);
    }

    /**
     * Retrieve the name of the module
     */
    Name(): string {
        return this.moduleName;
    }

    /**
     * Add user actions constants to the angular application
     */
    protected ActionConstants(): Action {
        return {
            Create: "create",
            Read: "read",
            Update: "update",
            Delete: "delete",
        };
    }

    /**
     * Add user resource constants to the angular application
     */
    protected ResourceConstants(): Resource {
        return {
            App: "app",
            Admin: "admin"
        };
    }
}
