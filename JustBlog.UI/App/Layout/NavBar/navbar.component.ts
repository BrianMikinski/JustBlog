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

    static $inject = ["$sce", "$uibModal", "coreService"];
    constructor($sce: ng.ISCEService, private $uibModal: ng.ui.bootstrap.IModalService,  private coreService: CoreService) {
        super($sce);
    }

    $onInit?(): void {

        let metadataCallBack: (data: Metadata) => void = (data: Metadata) => {
            this.metadata = data;
        };

        this.coreService.GetMetaData().then(metadataCallBack, this.OnErrorCallback);
    }

    isLoginModalShown: boolean = false;
    isLogoutModalShown: boolean = false;

    showLogin() {
        if (!this.isLoginModalShown) {

            this.isLoginModalShown = true;

            var modalInstance = this.$uibModal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: "modal-body",
                component: "identityModal",
                size: "sm",
                resolve: {
                    currentView: function () {
                        return "login";
                    }
                }
            });

            var reEnableModal: () => void = () => {
                this.isLoginModalShown = false;
            };

            modalInstance.closed.finally(reEnableModal);
            modalInstance.result.finally(reEnableModal);
        }
    }

    showLogout() {
        throw new Error("Not Implemented");
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