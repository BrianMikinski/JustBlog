import { User } from "admin/account/User";
import { AdminService } from "admin/admin.service";
import { LoginUpdate } from "admin/login/LoginUpdate";
import { ChangePasswordModel } from "admin/password/ChangePasswordModel";
import { ResetPasswordModel } from "admin/password/ResetPasswordModel";
import { Post } from "blog/post/Post";
import { AuthService } from "core/authorization/auth.service";
import { CoreService } from "core/core.service";
import { GridQuery } from "core/grid/GridQuery";
import { BaseController } from "core/models/BaseController";
import { NotificationFactory } from "notification/notification.factory";

/**
 * admin controller used for controlling and defining all admin portions of the application
 */
export class AdminController extends BaseController {

    ApplicationAdmins: Array<User> = [];
    IsLoggedIn: boolean;
    LoginUpdate: LoginUpdate;

    UpdatePasswordModel: ChangePasswordModel = new ChangePasswordModel();

    // forgotten Password
    ResetPasswordUser: ResetPasswordModel = new ResetPasswordModel();
    ForgottenPasswordEmail: string;
    Posts: GridQuery<Post>;

    BirthDateFormatOptions: Array<string> = ["dd-MMMM-yyyy", "yyyy/MM/dd", "dd.MM.yyyy", "shortDate"];
    BirthDateFormat: string = this.BirthDateFormatOptions[0];

    static $inject = ["coreService", "authService", "adminService", "notificationFactory", "$location", "$sce", "$window"];
    constructor(private coreService: CoreService,
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

        let onReadUserAccountsComplete: (data: Array<User>) => void;
        onReadUserAccountsComplete = (data: Array<User>) => {
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