import { AdminService } from "admin/admin.service";
import { ui } from "angular";
import { ComponentBase } from "Core/component.base";
import { BaseController } from "Core/Models/BaseController";
import { NotificationFactory } from "Notification/notification.factory";

export const ConfirmEmailComponentName: string = "confirmEmail";

/**
 * Component for displaying posts
 */
export class ConfirmEmailController extends BaseController implements ng.IController {

    EmailConfirmed: boolean = false;
    ConfirmationMessage: string = "Account could not be confirmed.";

    static inject = ["$sce", "notificationFactory", "adminService", "$state", "$stateParams"]
    constructor(public $sce: ng.ISCEService,
        private notificationFactory: NotificationFactory,
        private adminService: AdminService,
        private $state: ui.IStateService,
        private $stateParams: ui.IStateParamsService) {
        super($sce);
      
    }

    $onInit = () => {

        this.ConfirmationMessage = "Email Confirmation";

        let code: string = this.$state.params.code;
        let userId: string = this.$state.params.userId;

        this.confirmEmail(userId, code);
    }

    OnErrorCallback = () => {
        this.ConfirmationMessage = "Email address could not be confirmed.";
    }

    /**
     * Register a new user
     */
    confirmEmail(userId: string, code: string): void {

        let emailConfirmedSuccess: (response: any) => void = (response: any) => {

            this.ConfirmationMessage = "Email confirmed! Welcome to the club!";

            this.EmailConfirmed = true;
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
            return require("admin/register/confirmEmail.html");
        }];
    }
}