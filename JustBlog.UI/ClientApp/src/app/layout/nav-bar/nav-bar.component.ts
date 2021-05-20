import { IModalService } from "angular-ui-bootstrap";
import { Metadata } from "../../blog/metadata/MetaData";
import { ComponentBase } from "../../core/component.base";
import { CoreService } from "../../core/core.service";
import { BaseController } from "../../core/models/BaseController";

export const NavBarComponentName: string = "navbar";

/**
 * Controller for the Navigation Bar
 */
class NavBarComponentController extends BaseController implements ng.IController {

  isOpen: boolean = false;
  metadata: Metadata;

  static $inject = ["$sce", "$uibModal", "coreService"];
  constructor($sce: ng.ISCEService, private $uibModal: IModalService, private coreService: CoreService) {
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
    this.showModal("login");
  }

  showSignOut() {
    this.showModal("logoff");
  }

  private showModal(indentityModalView: "login" | "logoff") {
    this.toggle();

    if (!this.isLoginModalShown) {

      this.isLoginModalShown = true;

      let modalInstance = this.$uibModal.open({
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: "modal-body",
        component: "identityModal",
        backdrop: "static",
        size: "sm",
        resolve: {
          currentView: function () {
            return indentityModalView;
          }
        }
      });

      let reEnableModal: () => void = () => {
        this.isLoginModalShown = false;
      };

      modalInstance.closed.then((result) => {

      }, (error) => { }).finally(reEnableModal);

      modalInstance.result.then((result) => {

      }, (error) => { }).finally(reEnableModal);
    }
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
    this.template = (require("!raw-loader!./nav-bar.html") as any).default;
    //this.templateUrl = ["$element", "$attrs", ($element: ng.IAugmentedJQuery, $attrs: ng.IAttributes): string => {
    //  return require("!raw-loader!./nav-bar.html");
    //}];
  }
}
