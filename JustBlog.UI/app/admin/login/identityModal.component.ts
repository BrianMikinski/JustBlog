import { ITokenAuthResponse } from "admin/account/ITokenAuthResponse";
import { AdminService } from "admin/admin.service";
import { LoginModel } from "admin/login/LoginModel";
import { AuthService } from "core/authorization/auth.service";
import { ComponentBase } from "core/component.base";
import { BaseController } from "core/models/BaseController";
import { NotificationFactory } from "notification/notification.factory";

export const IdentityModalComponentName: string = "identityModal";

interface IIdentityModalControllerBindings {
    modalInstance: any,
    resolve: any;
}

/**
 * Controller for MyComponent
 */
class IdentityModalComponentController extends BaseController implements ng.IController, IIdentityModalControllerBindings {

    /**
     * modal
     */
    currentView: "login" | "logoff" | "registerUser" | "forgotPassword";

    modalInstance: any;
    resolve: any;

    /**
     * login 
     */

    private LoginUser: LoginModel = new LoginModel();
    private submitLogin: boolean = false;

    /**
     * forgot password
     */
    userEmail: string;
    resetPasswordEmailSent: boolean = false;
    submitResetRequest: boolean = false;

    inject = ["authService", "adminService", "notificationFactory", "$sce", "$state"]
    constructor(public authService: AuthService,
        public adminService: AdminService,
        public notificationFactory: NotificationFactory,
        public $sce: ng.ISCEService,
        public $state: ng.ui.IStateService) {
        super($sce);
    }

    $onInit?() {
        this.currentView = this.resolve.currentView;
    }

    /**
     * Form submit action
     * */
    identityModalAction() {
        switch (this.currentView) {
            case "login":
                this.login();
                break;
            case "forgotPassword":
                this.requestPasswordReset();
                break;
            default:
                break;
        }
    }

    /**
     * Register a new user
     * */

    showRegisterUser() {
        this.currentView = "registerUser";
    }

    isRegisterUserView() {
        return this.currentView === "registerUser";
    }

    /**
     * Login
     * */

    showLoginView() {
        this.currentView = "login";
    }

    isLoginView(): boolean {
        return this.currentView === "login";
    }

    /**
     * Log a user into the admin section of the application
     */
    login(): void {

        this.submitLogin = true;

        let onLoginCallback: (response: ITokenAuthResponse) => void;
        onLoginCallback = (response: ITokenAuthResponse) => {

            this.submitLogin = true;

            let authBearerTokenPresent: string | null = this.authService.GetLocalToken()

            if (authBearerTokenPresent !== null) {
                this.notificationFactory.Success("Login successful.");
                this.$state.go('manageContent');
                this.modalInstance.close();

            } else {

                // notify that we could not login
                this.notificationFactory.Error("Login for user " + this.LoginUser.Email + " was unsuccessful.");
            }
        };

        this.adminService.login(this.LoginUser)
            .then(onLoginCallback, this.OnErrorCallback);
    }

    /**
     * Logoff
     * */

    showLogoffView() {
        this.currentView = "logoff";
    }

    /**
     * Forgot password
     * */

    showForgotPasswordView() {
        this.currentView = "forgotPassword";
    }


    isForgotPasswordView() {
        return this.currentView === "forgotPassword";
    }

    /**
     * log a user into the admin section of the application
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
            .finally(() => {
                this.submitResetRequest = false;
            });
    }

    cancel(): void {
        this.modalInstance.dismiss();
    }

    OnErrorCallback = (error: any) => {
        this.submitLogin = false;
    };
}

/**
 * MyComponent Panel
 */
export class IdentityModalComponent extends ComponentBase {

    constructor() {
        super();

        this.bindings = {
            modalInstance: "<",
            resolve: "<"
        }

        this.controller = IdentityModalComponentController;

        this.templateUrl = ["$element", "$attrs", ($element: ng.IAugmentedJQuery, $attrs: ng.IAttributes): string => {
            return require("admin/login/identityModal.html");
        }];
    }
}