import { AdminService } from "admin/admin.service";
import { AuthService } from "Core/authorization/auth.service";
import { ComponentBase } from "Core/component.base";
import { BaseController } from "Core/Models/BaseController";
import { NotificationFactory } from "notification/notification.factory";

export const ResetPasswordComponentName: string = "resetPassword";

/**
 * Controller for MyComponent
 */
class ResetPasswordComponentController extends BaseController implements ng.IController {

    userEmail: string;
    resetPasswordEmailSent: boolean = false;
    submitReset: boolean = false;

    inject = ["authService", "adminService", "notificationFactory", "$sce", "$state"]
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
    resetPassword(): void {

        let onPasswordResetSubmitted: (response: boolean) => void;
        onPasswordResetSubmitted = (response: boolean) => {
            this.notificationFactory.Success("Please check your email to reset your password.");
        };

        this.submitReset = true;

        this.adminService.forgotPassword(this.userEmail)
            .then(onPasswordResetSubmitted, this.OnErrorCallback)
            .finally(()=> {
                this.submitReset = false;
        });
    }

    OnErrorCallback = (error: any) => {
        this.notificationFactory.Error("Error creating reset password workflow.");
    };
}

/**
 * MyComponent Panel
 */
export class ResetPasswordComponent extends ComponentBase {

    constructor() {
        super();

        this.bindings = {}

        this.controller = ResetPasswordComponentController;

        this.templateUrl = ["$element", "$attrs", ($element: ng.IAugmentedJQuery, $attrs: ng.IAttributes): string => {
            return require("admin/password/resetPassword.html");
        }];
    }
}