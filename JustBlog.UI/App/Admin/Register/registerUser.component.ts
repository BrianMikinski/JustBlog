import { ApplicationUser } from "admin/account/ApplicationUser";
import { ITokenAuthResponse } from "admin/account/ITokenAuthResponse";
import { AdminService } from "admin/admin.service";
import { LoginModel } from "admin/login/LoginModel";
import { IdentityError } from "admin/register/IdentityError";
import { RegistrationAttempt } from "admin/register/RegistrationAttempt";
import { RegistrationUser } from "admin/register/RegistrationUser";
import { AuthService } from "Core/auth.service";
import { ComponentBase } from "Core/component.base";
import { BaseController } from "Core/Models/BaseController";
import { NotificationFactory } from "Notification/notification.factory";

export const RegisterUserComponentName: string = "registerusercomponent";

/**
 * Component for displaying posts
 */
export class RegisterUserController extends BaseController implements ng.IController {

    CurrentUser: ApplicationUser = new ApplicationUser();
    NewUser: RegistrationUser = new RegistrationUser();

    DatePickerOptions: any = {
        dateDisabled: this.DateDisabled,
        formatYear: "yy",
        maxDate: Date.now(),
        minDate: new Date(1900, 0, 0),
        startingDay: 1
    };

    BirthDateFormat: string = "MM/dd/yyyy";

    AltInputFormats: Array<string> = ["M!/d!/yyyy"];

    userBirthDate: Date;

    /**
     * Datetime Popup
     */
    public DateTimePopup(): void {
        this.DatePickerPopup.opened = true;
    }

    // dateTime Picker Options
    DatePickerPopup: any = {
        opened: false
    };

    static inject = ["$sce", "notificationFactory", "adminService", "authService", "$location"]
    constructor(public $sce: ng.ISCEService,
        private notificationFactory: NotificationFactory,
        private adminService: AdminService,
        private authService: AuthService,
        private $location: ng.ILocationService) {
        super($sce);
    }

    /**
     * Register a new user
     */
    Register(): void {
        
        let onLoginSuccessCallback: (response: ITokenAuthResponse) => void = (response: ITokenAuthResponse) => {

            let authBearerTokenPresent: string | null = this.authService.GetLocalToken()

            if (authBearerTokenPresent !== null) {
                this.notificationFactory.Success(`Login for user ${this.CurrentUser.FirstName} ${this.CurrentUser.LastName} was successful`);

                // reroute to the management screen now that we are authenticated and registered
                this.$location.path("/manageContent");
            }
            else {
                this.notificationFactory.Error(`Error: Could not log user ${this.CurrentUser.FirstName} ${this.CurrentUser.LastName} into the system.`);
            }
        };

        let onRegistrationCallback: (response: RegistrationAttempt) => void;
        onRegistrationCallback = (response: RegistrationAttempt) => {

            if (response != null && response.Succeeded) {

                this.CurrentUser = response.User;

                this.notificationFactory.Success(`Registration was successful. Welcome to the blog ${this.CurrentUser.FirstName} ${this.CurrentUser.LastName}!`);

                let userLogin: LoginModel = {
                    Email: this.NewUser.Email,
                    Password: this.NewUser.Password,
                    RememberMe: false
                };

                this.adminService.login(userLogin).then(onLoginSuccessCallback, this.OnErrorCallback);

            } else {

                for (var i in response.Errors) {
                    let error: IdentityError = response.Errors[i];

                    this.notificationFactory.Error(`Error Code: ${error.Code} - ${error.Description}`);
                }
            }
        };

        this.NewUser.BirthDate = (<Date>this.userBirthDate).toLocaleDateString();

        this.adminService.registerUser(this.NewUser, this.AntiForgeryToken).then(onRegistrationCallback, this.OnErrorCallback);
    }

    /**
     * Disable the date
     * @param data
     */
    private DateDisabled(data: any): any {
        var date = data.date,
            mode = data.mode;
        return mode === "day" && (date.getDay() === 0 || date.getDay() === 6);
    }
}

export class RegisterUserComponent extends ComponentBase {
    constructor() {
        super();

        this.bindings = {}
        this.controller = RegisterUserController;
        this.controllerAs = "$registerUserCtrl";

        this.templateUrl = ["$element", "$attrs", ($element: ng.IAugmentedJQuery, $attrs: ng.IAttributes): string => {
            return require("Admin/Register/registerUser.html");
        }];
    }
}