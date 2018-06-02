import { AdminService } from "Admin/admin.service";
import { AuthService } from "Core/auth.service";
import { BaseController } from "Core/Models/BaseController";
import { ComponentBase } from "Core/component.base";
import { GridQuery } from "Core/Models/GridQuery";
import { ICoreService } from "Core/core.service";
import { LoginModel } from "Admin/Login/LoginModel";
import { NotificationFactory } from "Notification/notification.factory";
import { ITokenAuthResponse } from "Admin/Account/ITokenAuthResponse";

export const LoginComponentName: string = "login";

/**
 * Controller for MyComponent
 */
class LoginComponentController extends BaseController implements ng.IController {

    private LoginUser: LoginModel = new LoginModel();

    inject = ["authService", "adminService", "notificationFactory", "$sce", "$location"]
    constructor(public authService: AuthService,
                public adminService: AdminService,
                public notificationFactory: NotificationFactory,
                public $sce: ng.ISCEService,
                public $location: ng.ILocationService) {
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

                // reroute to the management screen now that we have logged in
                this.$location.path("/manageContent");
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
            return "Admin/Login/login.html"
        }];
    }
}