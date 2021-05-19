import { ComponentBase } from "../../core/component.base";
import { BaseController } from "../../core/models/BaseController";
import { NotificationFactory } from "../../notification/notification.factory";
import { AdminService } from "../admin.service";
import { ResetPasswordModel } from "./ResetPasswordModel";
import { ValidPassword } from "./ValidPassword";

export const ResetPasswordComponentName: string = "resetPassword";

/**
 * Controller for MyComponent
 */
class ResetPasswordComponentController extends BaseController implements ng.IController {

    userEmail: string;
    code: string;
    resetSubmitted: boolean = false;
    passwordResetSuccess: boolean = false;

    resetPasswordModel: ResetPasswordModel;
    passwordValidator: ValidPassword = {
        has6Characters: false,
        hasLowerCase: false,
        hasNonAlphaNumeric: false,
        hasNumeric: false,
        hasUpperCase: false,
        isValidPassword: false
    };

    static $inject = ["authService", "adminService", "notificationFactory", "$sce", "$state", "$timeout"]
    constructor(public adminService: AdminService,
        public notificationFactory: NotificationFactory,
        public $sce: ng.ISCEService,
        public $state: ng.ui.IStateService,
        public $timeout: ng.ITimeoutService) {
        super($sce);
    }

    $onInit?= () => {

        this.resetPasswordModel = {
            email: window.atob(this.$state.params.email),
            code: this.$state.params.code,
            password: "",
            confirmPassword: ""
        };

        this.isValidPassword();
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

    getPasswordValidor(): ValidPassword {
        return this.adminService.passwordValidation(this.resetPasswordModel.password);
    }

    /**
     * Check if the password is valid
     * */
    isValidPassword(): boolean {

        this.passwordValidator = this.adminService.passwordValidation(this.resetPasswordModel.password);
        return this.passwordValidator.isValidPassword;
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
