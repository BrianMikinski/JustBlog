import { ComponentBase } from "core/component.base";
import { BaseController } from "core/models/BaseController";

export const ShellComponentName: string = "shell";

/**
 * Controller for the Navigation Bar
 */
class ShellComponentController extends BaseController implements ng.IController {

    static $inject = ['$sce']
    constructor($sce: ng.ISCEService) {
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
            return require("layout/Shell/shell.html");
        }];
    }
}