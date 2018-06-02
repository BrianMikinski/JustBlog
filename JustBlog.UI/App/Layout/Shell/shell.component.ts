import { BaseController } from "Core/Models/BaseController";
import { ComponentBase } from "Core/component.base";
import { ICoreService } from "Core/core.service";
import { Post } from "Blog/Post/Post";
import { MetaData } from "Blog/MetaData/MetaData";

export const ShellComponentName: string = "shell";

/**
 * Controller for the Navigation Bar
 */
class ShellComponentController extends BaseController implements ng.IController {
   
    constructor(public $sce: ng.ISCEService) {
        super($sce);
    }

    $onInit?(): void { }
}

/**
 * Navigation Bar Header
 */
export class ShellComponent extends ComponentBase {

    constructor() {
        super();

        this.bindings = { }

        this.controller = ShellComponentController;
        this.controllerAs = "$shellCtrl"

        this.templateUrl = ["$element", "$attrs", ($element: ng.IAugmentedJQuery, $attrs: ng.IAttributes):string => {
            return "Layout/Shell/shell.html"
        }];
    }
}