import { BaseController } from "Core/Models/BaseController";
import { ComponentBase } from "Core/component.base";

export const AdminHeaderComponentName: string = "adminHeader";

export class AdminHeaderController extends BaseController implements ng.IController {

    static inject = ["$sce"]
    constructor(public $sce: ng.ISCEService) {
        super($sce);
    }
}

export class AdminHeaderComponent extends ComponentBase {
    constructor() {
        super();

        this.bindings = {}
        this.controller = AdminHeaderController;
        this.controllerAs = "$adminHeaderController";

        this.templateUrl = ["$element", "$attrs", ($element: ng.IAugmentedJQuery, $attrs: ng.IAttributes): string => {
            return require("Admin/adminHeader.html");
        }];
    }
}