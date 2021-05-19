import { ComponentBase } from "../core/component.base";
import { BaseController } from "../core/models/BaseController";



export const AdminHeaderComponentName: string = "adminHeader";

export class AdminHeaderController extends BaseController implements ng.IController {

    static $inject = ["$sce"]
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
            return require("admin/admin-header.html");
        }];
    }
}
