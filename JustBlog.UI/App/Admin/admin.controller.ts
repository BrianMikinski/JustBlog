import { ChangePasswordViewModel } from "Admin/password/ChangePasswordViewModel";
import { IChangePasswordViewModel } from "Admin/password/IChangePasswordViewModel";
import { LoginUpdate } from "admin/login/LoginUpdate";
import { IUser } from "Admin/Account/IUser";
import { ResetPasswordModel } from "Admin/password/ResetPasswordModel";
import { AdminService } from "Admin/admin.service";
import { Post } from "Blog/Post/Post";
import { BaseController } from "Core/Models/BaseController";
import { GridQuery } from "Core/Models/GridQuery";
import { AuthService } from "Core/auth.service";
import { ICoreService } from "Core/core.service";
import { NotificationFactory } from "Notification/notification.factory";

/**
 * admin controller used for controlling and defining all admin portions of the application
 */
export class AdminController extends BaseController {

    ApplicationAdmins: Array<IUser> = [];
    IsLoggedIn: boolean;
    LoginUpdate: LoginUpdate;
    MyCurrentUser: IUser;
    UpdatedAccount: IUser;
    UpdatePasswordModel: IChangePasswordViewModel = new ChangePasswordViewModel();

    // forgotten Password
    ResetPasswordUser: ResetPasswordModel = new ResetPasswordModel();
    ForgottenPasswordEmail: string;
    Posts: GridQuery<Post>;

    BirthDateFormatOptions: Array<string> = ["dd-MMMM-yyyy", "yyyy/MM/dd", "dd.MM.yyyy", "shortDate"];
    BirthDateFormat: string = this.BirthDateFormatOptions[0];

    static $inject = ["coreService", "authService", "adminService", "notificationFactory", "$location", "$sce", "$window"];
    constructor(private coreService: ICoreService,
        private _authService: AuthService,
        private _adminService: AdminService,
        private _notificationService: NotificationFactory,
        private $location: ng.ILocationService,
        public $sce: ng.ISCEService,
        private $window: ng.IWindowService) {
        super($sce);

        this.SetErrorMessage("An error has been encountered in the Base Controller.");

        if ($location.path() === "/accounts") {
            this.ReadUserAccounts();
        }

        if ($location.path() === "/myAccount") {
            this.MyAccount(false);
        }

        if ($location.path() === "/updateAccount") {
            this.MyAccount(true);
        }
    }

    /**
     * Submit an email address to send a reset password email
     */
    public ResetPassword(): void {

        let onPasswordResetSubmitted: (response: boolean) => void;
        onPasswordResetSubmitted = (response: boolean) => {
            let loginAttempt: boolean = <boolean>response;
            if (loginAttempt) {

                this._notificationService.Success("An email has been sent to reset your password.");

                // reroute to the management screen now that we have logged in
                this.$location.path("/manageContent");
            } else {
                // notify that we did 
                this._notificationService.Success("Email could not be sent.");
            }
        };

        this._adminService.ForgotPassword(this.ForgottenPasswordEmail, this.AntiForgeryToken).then(onPasswordResetSubmitted, this.OnErrorCallback);
    }

    /**
     * Update the password on an account
     */
    public UpdatePassword(): void {

        let onPasswordChangeCompleted: (response: boolean) => void;
        onPasswordChangeCompleted = (response: boolean) => {
            let loginAttempt = <boolean>response;
            if (loginAttempt) {

                this._notificationService.Success("Password was successfully changed.");

                // reroute to the management screen now that we have logged in
                this.$location.path("/myAccount");
            } else {
                // notify that we did 
                this._notificationService.Error("Error, password could not be updated.");
            }
        };

        this._adminService.UpdatePassword(this.UpdatePasswordModel, this.AntiForgeryToken).then(onPasswordChangeCompleted, this.OnErrorCallback);
    }

    /**
     * Getting all of the registered user accounts
     */
    public ReadUserAccounts(): void {

        let onReadUserAccountsComplete: (data: Array<IUser>) => void;
        onReadUserAccountsComplete = (data: Array<IUser>) => {
            this.ApplicationAdmins = data;
        };

        this._adminService.ReadApplicationUsers().then(onReadUserAccountsComplete, this.OnErrorCallback);
    }

    /**
     * Get the currently logged in users account information
     */
    public MyAccount(isUpdatedAccount: boolean): void {
        let onReadMyAccountComplete: (data: IUser) => void;

        onReadMyAccountComplete = (data: IUser) => {
            data.BirthDate = this.calculateBirthDate(data.BirthDate.toString());

            if (!isUpdatedAccount) {
                this.MyCurrentUser = data;
            } else {
                this.UpdatedAccount = data;
            }
        };

        this._adminService.MyAccount().then(onReadMyAccountComplete, this.OnErrorCallback);
    }

    /**
     * Update the currently logged in user
     */
    public UpdateAccount(): void {

        let onUpdateAccountComplete: (data: boolean) => void;

        onUpdateAccountComplete = (data: boolean) => {
            if (data === true) {
                this._notificationService.Success("Account details successfully updated.");
            } else {
                this._notificationService.Error("Account details could not be updated.");
            }

            this.$location.path("/myAccount");
        };

        // make sure we don't update our email address nor user name
        this.UpdatedAccount.Email = "";
        this.UpdatedAccount.UserName = "";
        this.UpdatedAccount.LockoutEndDateUtc = new Date();

        this._adminService.UpdateUser(this.UpdatedAccount, this.AntiForgeryToken).then(onUpdateAccountComplete, this.OnErrorCallback);
    }

    /**
     * Update the currently logged in user's email address
     */
    public UpdateLogin(): void {

        let onUpdateLoginComplete: (data: boolean) => void;

        onUpdateLoginComplete = (data: boolean) => {
            if (data === true) {
                this._notificationService.Success("Login successfully updated.");
            } else {
                this._notificationService.Error("Login could not be updated.");
            }

            this.$location.path("/myAccount");
        };

        this._adminService.UpdateUserLogin(this.LoginUpdate, this.AntiForgeryToken).then(onUpdateLoginComplete, this.OnErrorCallback);
    }

    /**
     * Calcuate a birthdate in the current format
     * @param date
     */
    private calculateBirthDate(date: string): Date {
        let currentBirthDay: Date | null = this.ParseJsonDate(date.toString());

        let day: number | undefined = currentBirthDay ? currentBirthDay.getDay() : undefined;
        let month: number | undefined = currentBirthDay ? currentBirthDay.getMonth() : undefined;
        let year: number | undefined = currentBirthDay ? currentBirthDay.getFullYear() : undefined;

        if (month && day && year) {
            currentBirthDay = new Date(month.toString() + "/" + day.toString() + "/" + year.toString());
            return new Date(currentBirthDay.toLocaleDateString());
        }
        else {
            return new Date();
        }
    }
}