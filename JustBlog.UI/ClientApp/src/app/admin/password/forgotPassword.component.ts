import { AuthService } from "../../core/authorization/auth.service";
import { ComponentBase } from "../../core/component.base";
import { BaseController } from "../../core/models/BaseController";
import { NotificationFactory } from "../../notification/notification.factory";
import { AdminService } from "../admin.service";


export const ForgotPasswordComponentName: string = "forgotPassword";

/**
 * Controller for MyComponent
 */
class ForgotPasswordComponentController extends BaseController implements ng.IController {

    userEmail: string;
    resetPasswordEmailSent: boolean = false;
    submitResetRequest: boolean = false;

    static $inject = ["authService", "adminService", "notificationFactory", "$sce", "$state"]
    constructor(public authService: AuthService,
        public adminService: AdminService,
        public notificationFactory: NotificationFactory,
        public $sce: ng.ISCEService,
        public $state: ng.ui.IStateService) {
        super($sce);
    }

    /**
     * Log a user into the admin section of the application
     */
    requestPasswordReset(): void {

        let onPasswordResetSubmitted: () => void;
        onPasswordResetSubmitted = () => {
            this.notificationFactory.Success("Please check your email to reset your password.");
            this.resetPasswordEmailSent = true;
        };

        this.submitResetRequest = true;

        this.adminService.requestPasswordReset(this.userEmail)
            .then(onPasswordResetSubmitted, this.OnErrorCallback)
            .finally(()=> {
                this.submitResetRequest = false;
        });
    }

    OnErrorCallback = (error: any) => {
        this.notificationFactory.Error("Error creating reset password workflow.");
    };
}

/**
 * MyComponent Panel
 */
export class ForgotPasswordComponent extends ComponentBase {

    constructor() {
        super();

        this.bindings = { }

        this.controller = ForgotPasswordComponentController;

        this.templateUrl = ["$element", "$attrs", ($element: ng.IAugmentedJQuery, $attrs: ng.IAttributes): string => {
            return require("admin/password/forgotPassword.html");
        }];
    }
}
