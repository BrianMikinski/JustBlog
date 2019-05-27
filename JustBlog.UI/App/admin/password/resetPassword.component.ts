import { AdminService } from "admin/admin.service";
import { AuthService } from "Core/authorization/auth.service";
import { ComponentBase } from "Core/component.base";
import { BaseController } from "Core/Models/BaseController";
import { NotificationFactory } from "notification/notification.factory";
import { IResetPasswordModel } from "./IResetPasswordModel";

export const ResetPasswordComponentName: string = "resetPassword";

/**
 * Controller for MyComponent
 */
class ResetPasswordComponentController extends BaseController implements ng.IController {

    userEmail: string;
    code: string;
    resetSubmitted: boolean = false;
    passwordResetSuccess: boolean = false;

    resetPasswordModel: IResetPasswordModel;

    inject = ["authService", "adminService", "notificationFactory", "$sce", "$state"]
    constructor(public adminService: AdminService,
        public notificationFactory: NotificationFactory,
        public $sce: ng.ISCEService,
        public $state: ng.ui.IStateService) {
        super($sce);
    }

    $onInit?= () => {

        this.resetPasswordModel = {
            email: this.$state.params.email,
            code: this.$state.params.code,
            password: "",
            confirmPassword: ""
        };
    }

    /**
     * Log a user into the admin section of the application
     */
    resetPassword(): void {

        let onPasswordResetSubmitted: () => void;
        onPasswordResetSubmitted = () => {
            this.notificationFactory.Success("Password successfully reset!.");
            this.passwordResetSuccess = true;
        };

        this.resetSubmitted = true;

        this.adminService.resetPassword(this.resetPasswordModel)
            .then(onPasswordResetSubmitted, this.OnErrorCallback)
            .finally(() => {
                this.resetSubmitted = false;
            });
    }

    OnErrorCallback = (error: any) => {
        this.notificationFactory.Error("Error creating reset password workflow.");
        this.passwordResetSuccess = false;
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