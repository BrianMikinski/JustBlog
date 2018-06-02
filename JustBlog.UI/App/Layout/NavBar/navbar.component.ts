import { BaseController } from "Core/Models/BaseController";
import { ComponentBase } from "Core/component.base";
import { ICoreService } from "Core/core.service";
import { Post } from "Blog/Post/Post";
import { MetaData } from "Blog/MetaData/MetaData";

export const NavBarComponentName: string = "navbar";

/**
 * Controller for the Navigation Bar
 */
class NavBarComponentController extends BaseController implements ng.IController {
   
    constructor(public $sce: ng.ISCEService) {
        super($sce);
    }

    $onInit?(): void { }
}

/**
 * Navigation Bar Header
 */
export class NavBarComponent extends ComponentBase {

    constructor() {
        super();

        this.bindings = { }

        this.controller = NavBarComponentController;
        this.controllerAs = "$navBarCtrl"

        this.templateUrl = ["$element", "$attrs", ($element: ng.IAugmentedJQuery, $attrs: ng.IAttributes):string => {
            return "Layout/NavBar/navbar.html"
        }];
    }
}