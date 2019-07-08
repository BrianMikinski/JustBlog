import { AdminService } from "admin/admin.service";
import { ui } from "angular";
import { ComponentBase } from "core/component.base";
import { BaseController } from "core/models/BaseController";

export const ConfirmEmailComponentName: string = "confirmEmail";

export class ConfirmEmailComponent extends ComponentBase {
    constructor() {
        super();

        this.bindings = {}
        this.controller = ConfirmEmailController;

        this.templateUrl = ["$element", "$attrs", ($element: ng.IAugmentedJQuery, $attrs: ng.IAttributes): string => {
            return require("admin/register/confirmEmail.html");
        }];
    }
}

/**
 * Component for displaying posts
 */
export class ConfirmEmailController extends BaseController implements ng.IController {

    emailConfirmed: boolean = false;
    confirmationMessage: string = "Email Confirmation";

    static $inject = ["$sce", "adminService", "$state"]
    constructor(public $sce: ng.ISCEService,
        private adminService: AdminService,
        private $state: ui.IStateService) {
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

