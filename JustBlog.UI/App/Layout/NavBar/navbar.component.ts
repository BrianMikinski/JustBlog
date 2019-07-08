import { BaseController } from "core/models/BaseController";
import { ComponentBase } from "core/component.base";

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
            return require("layout/navBar/navbar.html");
        }];
    }
}