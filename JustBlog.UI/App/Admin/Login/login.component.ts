import { ITokenAuthResponse } from "admin/account/ITokenAuthResponse";
import { AdminService } from "admin/admin.service";
import { LoginModel } from "admin/login/LoginModel";
import { AuthService } from "Core/auth.service";
import { ComponentBase } from "Core/component.base";
import { BaseController } from "Core/Models/BaseController";
import { NotificationFactory } from "Notification/notification.factory";

export const LoginComponentName: string = "login";

/**
 * Controller for MyComponent
 */
class LoginComponentController extends BaseController implements ng.IController {

    private LoginUser: LoginModel = new LoginModel();
    private submitLogin: boolean = false;

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

            } else {

                // notify that we could not login
                this.notificationFactory.Error("Login for user " + this.LoginUser.Email + " was unsuccessful.");
            }
        };

        this.adminService.login(this.LoginUser)
            .then(onLoginCallback, this.OnErrorCallback);
    }

    OnErrorCallback = (error: any) => {
        this.submitLogin = false;
    };
}

/**
 * MyComponent Panel
 */
export class LoginComponent extends ComponentBase {

    constructor() {
        super();

        this.bindings = {}

        this.controller = LoginComponentController;

        this.templateUrl = ["$element", "$attrs", ($element: ng.IAugmentedJQuery, $attrs: ng.IAttributes): string => {
            return require("admin/login/login.html");
        }];
    }
}