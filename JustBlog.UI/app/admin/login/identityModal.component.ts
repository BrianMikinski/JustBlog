import { ITokenAuthResponse } from "admin/account/ITokenAuthResponse";
import { AdminService } from "admin/admin.service";
import { LoginModel } from "admin/login/LoginModel";
import { AuthService } from "core/authorization/auth.service";
import { ComponentBase } from "core/component.base";
import { BaseController } from "core/models/BaseController";
import { NotificationFactory } from "notification/notification.factory";
import { RegistrationAttempt } from "admin/register/RegistrationAttempt";
import { ApplicationUser } from "admin/account/ApplicationUser";
import { RegistrationUser } from "admin/register/RegistrationUser";
import { IdentityError } from "admin/register/IdentityError";

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
     * Register user 
     */
    currentUser: ApplicationUser = new ApplicationUser();
    newUser: RegistrationUser = new RegistrationUser();

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
            case "registerUser":
                this.registerNewUser();
            default:
                break;
        }
    }

    /**
     * Register a new user
     * */

    showRegisterUserView() {
        this.currentView = "registerUser";
    }

    /**
     * 
     * */
    isRegisterUserView() {
        return this.currentView === "registerUser";
    }

    /**
     * Register a new user
     */
    registerNewUser(): void {

        let onLoginSuccessCallback: (response: ITokenAuthResponse) => void = (response: ITokenAuthResponse) => {

            let authBearerTokenPresent: string | null = this.authService.GetLocalToken()

            if (authBearerTokenPresent !== null) {
                this.notificationFactory.Success(`Login for user ${this.currentUser.Email}was successful`);

                // reroute to the management screen now that we are authenticated and registered
                this.$state.go("manageContent");
            }
            else {
                this.notificationFactory.Error(`Error: Could not log user ${this.currentUser.Email} into the system.`);
            }
        };

        let onRegistrationCallback: (response: RegistrationAttempt) => void;
        onRegistrationCallback = (response: RegistrationAttempt) => {

            if (response != null && response.Succeeded) {

                this.currentUser = response.User;

                this.notificationFactory.Success(`Registration was successful. Welcome to the blog ${this.currentUser.Email}!`);

                let userLogin: LoginModel = {
                    Email: this.newUser.Email,
                    Password: this.newUser.Password,
                    RememberMe: false
                };

                this.adminService.login(userLogin)
                    .then(onLoginSuccessCallback, this.OnErrorCallback);

            } else {

                for (var i in response.Errors) {
                    let error: IdentityError = response.Errors[i];

                    this.notificationFactory.Error(`Error Code: ${error.Code} - ${error.Description}`);
                }
            }
        };

        this.adminService.registerUser(this.newUser).then(onRegistrationCallback, this.OnErrorCallback);
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