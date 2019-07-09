import { ITokenAuthResponse } from "admin/account/ITokenAuthResponse";
import { AdminService } from "admin/admin.service";
import { LoginModel } from "admin/login/LoginModel";
import { AuthService } from "core/authorization/auth.service";
import { ComponentBase } from "core/component.base";
import { BaseController } from "core/models/BaseController";
import { NotificationFactory } from "notification/notification.factory";

export const LoginModalComponentName: string = "login";

interface ILoginModalControllerBindings {
    modalInstance: any,
    resolve: any
}

/**
 * Controller for MyComponent
 */
class LoginModalComponentController extends BaseController implements ng.IController, ILoginModalControllerBindings {

    private LoginUser: LoginModel = new LoginModel();
    private submitLogin: boolean = false;

    modalInstance: any;
    resolve: any;

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
    private login(): void {

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

    private close(): void {
        this.modalInstance.dismiss();
    }

    OnErrorCallback = (error: any) => {
        this.submitLogin = false;
    };
}

/**
 * MyComponent Panel
 */
export class LoginModalComponent extends ComponentBase {

    constructor() {
        super();

        this.bindings = {
            modalInstance: "<",
            resolve: "<"
        }

        this.controller = LoginModalComponentController;

        this.templateUrl = ["$element", "$attrs", ($element: ng.IAugmentedJQuery, $attrs: ng.IAttributes): string => {
            return require("admin/login/loginModal.html");
        }];
    }
}