
/**
 * Abstract base class for angular components. This is defined
 * so developers do not have to redefine these properties in components
 */
export abstract class ComponentBase implements ng.IComponentOptions {
    public bindings: { [boundProperty: string]: string };
    public controller: ng.Injectable<ng.IControllerConstructor>;
    public controllerAs: string;
    public template: string;
    public templateUrl: string | ng.Injectable<(...args: any[]) => string>;
};