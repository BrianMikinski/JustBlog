import { ITokenAuthResponse } from "Admin/Account/ITokenAuthResponse";
import { AdminService } from "Admin/admin.service";
import { LoginModel } from "Admin/Login/LoginModel";
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
    private Login(): void {

        let onLoginCallback: (response: ITokenAuthResponse) => void;
        onLoginCallback = (response: ITokenAuthResponse) => {

            let authBearerTokenPresent: string | null = this.authService.GetLocalToken()

            if (authBearerTokenPresent !== null) {
                this.notificationFactory.Success("Login successful.");
                this.$state.go('manageContent');

            } else {

                // notify that we could not login
                this.notificationFactory.Error("Login for user " + this.LoginUser.Email + " was unsuccessful.");
            }
        };

        this.adminService.Login(this.LoginUser).then(onLoginCallback, this.OnErrorCallback);
    }
}

/**
 * MyComponent Panel
 */
export class LoginComponent extends ComponentBase {

    constructor() {
        super();

        this.bindings = {}

        this.controller = LoginComponentController;
        this.controllerAs = "$loginCtrl"

        this.templateUrl = ["$element", "$attrs", ($element: ng.IAugmentedJQuery, $attrs: ng.IAttributes): string => {
            return require("Admin/Login/login.html");
        }];
    }
}