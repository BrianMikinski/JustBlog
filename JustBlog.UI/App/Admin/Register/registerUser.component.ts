import { AdminService } from "Admin/admin.service";
import { ApplicationUser } from "Admin/Account/ApplicationUser";
import { BaseController } from "Core/Models/BaseController";
import { ComponentBase } from "Core/component.base";
import { NotificationFactory } from "Notification/notification.factory";
import { RegistrationAttempt } from "Admin/Register/RegistrationAttempt";
import { RegistrationUser } from "Admin/Register/RegistrationUser";
import { IdentityError } from "Admin/Register/IdentityError";
import { LoginModel } from "Admin/Login/LoginModel";
import { IHttpResponse } from "angular";
import { ITokenAuthResponse } from "Admin/Account/ITokenAuthResponse";
import { AuthService } from "Core/auth.service";

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

            let registrationAttempt = <RegistrationAttempt>response;

            if (registrationAttempt != null && registrationAttempt.Succeeded) {

                this.CurrentUser = registrationAttempt.User;

                this.notificationFactory.Success(`Registration was successful. Welcome to the blog ${this.CurrentUser.FirstName} ${this.CurrentUser.LastName}!`);

                let userLogin: LoginModel = {
                    Email: this.NewUser.Email,
                    Password: this.NewUser.Password,
                    RememberMe: false
                };

                this.adminService.Login(userLogin).then(onLoginSuccessCallback, this.OnErrorCallback);

            } else {

                for (var i in registrationAttempt.Errors) {
                    let error: IdentityError = registrationAttempt.Errors[i];

                    this.notificationFactory.Error(`Error Code: ${error.Code} - ${error.Description}`);
                }
            }
        };

        this.NewUser.BirthDate = (<Date>this.NewUser.BirthDate).toLocaleDateString();

        this.adminService.RegisterUser(this.NewUser, this.AntiForgeryToken).then(onRegistrationCallback, this.OnErrorCallback);
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
            return require("Admin/Register/register.html");
        }];
    }
}