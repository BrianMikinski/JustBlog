import { BaseController } from "core/models/BaseController";
import { ComponentBase } from "core/component.base";
import { CoreService } from "core/core.service";
import { Metadata } from "blog/metaData/MetaData";

export const NavBarComponentName: string = "navbar";

/**
 * Controller for the Navigation Bar
 */
class NavBarComponentController extends BaseController implements ng.IController {

    isOpen: boolean = false;
    metadata: Metadata;

    static $inject = ["$sce", "coreService"];
    constructor($sce: ng.ISCEService, private coreService: CoreService) {
        super($sce);
    }

    $onInit?(): void {

        let metadataCallBack: (data: Metadata) => void = (data: Metadata) => {
            this.metadata = data;
        };

        this.coreService.GetMetaData().then(metadataCallBack, this.OnErrorCallback);
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

        this.templateUrl = ["$element", "$attrs", ($element: ng.IAugmentedJQuery, $attrs: ng.IAttributes): string => {
            return require("layout/navBar/navbar.html");
        }];
    }
}