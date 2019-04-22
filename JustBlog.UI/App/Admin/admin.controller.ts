import { IUser } from "admin/account/IUser";
import { AdminService } from "admin/admin.service";
import { LoginUpdate } from "admin/login/LoginUpdate";
import { ChangePasswordViewModel } from "admin/password/ChangePasswordViewModel";
import { ResetPasswordModel } from "admin/password/ResetPasswordModel";
import { Post } from "Blog/Post/Post";
import { AuthService } from "Core/auth.service";
import { ICoreService } from "Core/core.service";
import { BaseController } from "Core/Models/BaseController";
import { GridQuery } from "Core/Models/GridQuery";
import { NotificationFactory } from "Notification/notification.factory";

/**
 * admin controller used for controlling and defining all admin portions of the application
 */
export class AdminController extends BaseController {

    ApplicationAdmins: Array<IUser> = [];
    IsLoggedIn: boolean;
    LoginUpdate: LoginUpdate;

    UpdatePasswordModel: ChangePasswordViewModel = new ChangePasswordViewModel();

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

        this._adminService.forgotPassword(this.ForgottenPasswordEmail, this.AntiForgeryToken).then(onPasswordResetSubmitted, this.OnErrorCallback);
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

        this._adminService.updatePassword(this.UpdatePasswordModel, this.AntiForgeryToken).then(onPasswordChangeCompleted, this.OnErrorCallback);
    }

    /**
     * Getting all of the registered user accounts
     */
    public ReadUserAccounts(): void {

        let onReadUserAccountsComplete: (data: Array<IUser>) => void;
        onReadUserAccountsComplete = (data: Array<IUser>) => {
            this.ApplicationAdmins = data;
        };

        this._adminService.readApplicationUsers().then(onReadUserAccountsComplete, this.OnErrorCallback);
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

        this._adminService.updateUserLogin(this.LoginUpdate, this.AntiForgeryToken).then(onUpdateLoginComplete, this.OnErrorCallback);
    }
}