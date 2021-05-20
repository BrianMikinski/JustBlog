import { IStateService } from "angular-ui-router";
import { ComponentBase } from "../../core/component.base";
import { BaseController } from "../../core/models/BaseController";
import { AdminService } from "../admin.service";

export const ConfirmEmailComponentName: string = "confirmEmail";

/**
 * Component for displaying posts
 */
export class ConfirmEmailController extends BaseController implements ng.IController {

    emailConfirmed: boolean = false;
    confirmationMessage: string = "Email Confirmation";

    static $inject = ["$sce", "adminService", "$state"]
    constructor(public $sce: ng.ISCEService,
        private adminService: AdminService,
        private $state: IStateService) {
        super($sce);
      
    }

    $onInit?():void {

        let code: string = this.$state.params.code;
        let userId: string = this.$state.params.userId;

        this.confirmEmail(userId, code);
    }

    OnErrorCallback = () => {
        this.confirmationMessage = "Email address could not be confirmed.";
    }

    /**
     * Register a new user
     */
    confirmEmail(userId: string, code: string): void {

        let emailConfirmedSuccess: (response: any) => void = (response: any) => {

            this.confirmationMessage = "Email Confirmed";

            this.emailConfirmed = true;
        };

        this.adminService.confirmUserEmail(userId, code)
            .then(emailConfirmedSuccess, this.OnErrorCallback);
    }
}

export class ConfirmEmailComponent extends ComponentBase {
    constructor() {
        super();

        this.bindings = {}
        this.controller = ConfirmEmailController;

        this.templateUrl = ["$element", "$attrs", ($element: ng.IAugmentedJQuery, $attrs: ng.IAttributes): string => {
          return require("!raw-loader!./confirmEmail.html");
        }];
    }
}
