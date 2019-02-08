import { BaseController } from "Core/Models/BaseController";
import { ComponentBase } from "Core/component.base";

export const NavBarComponentName: string = "navbar";

/**
 * Controller for the Navigation Bar
 */
class NavBarComponentController extends BaseController implements ng.IController {

    isOpen: boolean = false;

    constructor(public $sce: ng.ISCEService) {
        super($sce);
    }

    $onInit?(): void {
        
    }

    toggle() {
        this.isOpen = !this.isOpen;
    }

}

/**
 * Navigation Bar Header
 */
export class NavBarComponent extends ComponentBase {

    constructor() {
        super();

        this.bindings = {}

        this.controller = NavBarComponentController;
        this.controllerAs = "$navBarCtrl";

        this.templateUrl = ["$element", "$attrs", ($element: ng.IAugmentedJQuery, $attrs: ng.IAttributes): string => {
            return require("Layout/NavBar/navbar.html");
        }];
    }
}