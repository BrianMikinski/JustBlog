import { LoginUpdate } from "admin/login/LoginUpdate";
import { ITokenAuthResponse } from "Admin/Account/ITokenAuthResponse";
import { IUser } from "Admin/Account/IUser";
import { IAuthEventConstants } from "Admin/Interfaces/IAuthEventConstants";
import { IHttpAdminRoutes } from "Admin/Interfaces/IHttpAdminRoutes";
import { LoginModel } from "Admin/Login/LoginModel";
import { IChangePasswordViewModel } from "Admin/password/IChangePasswordViewModel";
import { RegistrationAttempt } from "Admin/Register/RegistrationAttempt";
import { RegistrationUser } from "Admin/Register/RegistrationUser";
import { AuthService } from "Core/auth.service";
import { IAuthenticationConstants } from "Core/Interfaces/IAuthenticationConstants";
import { BaseService } from "Core/Models/BaseService";

//Admin service class that allows users to perform common account management actions
export class AdminService extends BaseService {

    MangementEndPont: string = "/Manage/";

    private httpPostConfig: ng.IRequestShortcutConfig = {
        headers: {
            "Accept": "application/json",
            "Content": "application/x-www-form-urlencoded",
            "Content-Type": "application/x-www-form-urlencoded",
            "charset": "utf-8"
        }
    };

    /**
     * Setup error handling
     * @param $http
     */
    $inject = ["$rootScope", "$http", "authService", "AUTHENTICATION_CONSTANTS", "ADMIN_ROUTE_CONSTANTS", "AUTH_EVENT_CONSTANTS"];
    constructor(private $rootScope: ng.IRootScopeService,
        private $http: ng.IHttpService,
        private authService: AuthService,
        private AUTHENTICATION_CONSTANTS: IAuthenticationConstants,
        private AUTH_ROUTE_CONSTANTS: IHttpAdminRoutes,
        private AUTH_EVENT_CONSTANTS: IAuthEventConstants) {
        super();

        this.SetErrorMessage("An error was encountered in the admin service");
    }

    /**
     * Get all registered users
     */
    Users(): ng.IPromise<void | Array<IUser>> {

        // defining callback within function
        let onDataReturned: (response: ng.IHttpPromiseCallbackArg<Array<IUser>>) => Array<IUser>;
        onDataReturned = (response: ng.IHttpPromiseCallbackArg<Array<IUser>>) => {
            return <Array<IUser>>JSON.parse(<any>response.data);
        };

        return this.$http.post("/manage/ReadIdentityUsers", null).then(onDataReturned, this.onError);
    }

    /**
     * Register a new account
     * @param newUser
     * @param antiForgeryToken
     */
    RegisterUser(newUser: RegistrationUser, antiForgeryToken: string): ng.IPromise<void | RegistrationAttempt> {

        let params = {
            model: newUser,
            returnUrl: ""
        };

        let onRegistrationCallback: (response: ng.IHttpPromiseCallbackArg<RegistrationAttempt>) => RegistrationAttempt;
        onRegistrationCallback = (response: ng.IHttpPromiseCallbackArg<RegistrationAttempt>) => {
            return <RegistrationAttempt>response.data;
        };

        return this.$http.post(`${this.AUTH_ROUTE_CONSTANTS.RegisterNewUser}`, this.SerializeToQueryStringParams(params, null), this.httpPostConfig)
            .then(onRegistrationCallback, this.onError);
    }

    /**
     * Remove an account
     * @param userGUID
     */
    DeleteUser(userGUID: string): ng.IPromise<boolean> {
        throw new Error("Not Implemented");
    }

    /**
     * Change a users password
     * @param user
     * @param antiForgeryToken
     */
    UpdatePassword(updatePasswordModel: IChangePasswordViewModel, antiForgeryToken: string): ng.IPromise<void | boolean> {
        //Add headers for anti forgery token
        let config: ng.IRequestShortcutConfig = this.ConfigAntiForgery(antiForgeryToken);

        let onLoginCallback: (response: ng.IHttpPromiseCallbackArg<boolean>) => boolean;
        onLoginCallback = (response: ng.IHttpPromiseCallbackArg<boolean>) => {
            return <boolean>response.data;
        };

        return this.$http.post("/Manage/ChangePassword", updatePasswordModel, config).then(onLoginCallback, this.onError);
    }

    /**
     * Submit a user's email address for password reset
     * @param emailAddress
     * @param antiForgeryToken
     */
    ForgotPassword(emailAddress: string, antiForgeryToken: string): ng.IPromise<void | boolean> {

        //Add headers for anti forgery token
        let config: ng.IRequestShortcutConfig = this.ConfigAntiForgery(antiForgeryToken);

        let onSendPasswordResetCode: (response: ng.IHttpPromiseCallbackArg<boolean>) => boolean;
        onSendPasswordResetCode = (response: ng.IHttpPromiseCallbackArg<boolean>) => {
            return <boolean>response.data;
        };

        return this.$http.post("/Submit/Login", emailAddress, config).then(onSendPasswordResetCode, this.onError);
    }

    /**
     * Service for updating a forgotten password
     * @param ForgottenPasswordModel
     */
    ForgotPasswordUpdateAccount(ForgottenPasswordModel: any): void {
        throw new Error("Not Implemented");
    }

    /**
     * Login a user
     * @param loginModel
     * @param antiForgeryToken
     */
    Login(loginModel: LoginModel): ng.IPromise<void | ITokenAuthResponse> {

        let onLoginCallback: (response: ng.IHttpPromiseCallbackArg<ITokenAuthResponse>) => ITokenAuthResponse;
        onLoginCallback = (response: ng.IHttpPromiseCallbackArg<ITokenAuthResponse>) => {

            if (response.status === 200) {

                let authResponse: ITokenAuthResponse =  response.data;
                this.authService.SetUserToken(authResponse.auth_token);
                this.$rootScope.$broadcast(this.AUTH_EVENT_CONSTANTS.loginSuccess, true);

                return response.data;
            } else {
                this.$rootScope.$broadcast(this.AUTH_EVENT_CONSTANTS.loginFailed, false);
                throw new Error("Admin Service: User could not be logged in");
            }
        };

        this.httpPostConfig.data = loginModel;

        return this.$http.post(`${this.AUTH_ROUTE_CONSTANTS.Login}`, this.SerializeToQueryStringParams(loginModel, null), this.httpPostConfig)
            .then(onLoginCallback, this.onError);
    }

    /**
     * Log a user out of the admin area
     * @param antiForgeryToken
     */
    LogOff(antiForgeryToken: string): ng.IPromise<void | boolean> {

        let params: any = {};
        let config: ng.IRequestShortcutConfig = this.ConfigAntiForgery(antiForgeryToken);

        let onLogoffCallback: (response: ng.IHttpPromiseCallbackArg<boolean>) => boolean;
        onLogoffCallback = (response: ng.IHttpPromiseCallbackArg<boolean>) => {

            let logoffStatus: boolean = <boolean>response.data;

            // remove the auth token value so we know we are logged off
            if (logoffStatus != null && logoffStatus === true) {
                this.authService.DestroyUserTokens();

                // false here so that we let event handlers know we're not logged-in anymore
                this.$rootScope.$broadcast(this.AUTH_EVENT_CONSTANTS.logoutSuccess, false); 
            }

            return <boolean>response.data;
        };

        return this.$http.post(`${this.AUTH_ROUTE_CONSTANTS.Logoff}`,
                    params,
                    this.ConfigSecureAppJson(antiForgeryToken, this.authService.GetLocalToken())).then(onLogoffCallback, this.onError);
    }

    /**
     * Get the currently logged in users account information
     */
    MyAccount(): ng.IPromise<void | IUser> {
        let onAntiForgeryTokenCallback: (response: ng.IHttpPromiseCallbackArg<IUser>) => IUser =
            (response: ng.IHttpPromiseCallbackArg<IUser>) => {
                return <IUser>response.data;
            };

        let params = {};

        return this.$http.post("/Account/MyAccount", params).then(onAntiForgeryTokenCallback, this.onError);
    }

    /**
     * Update a user account
     * @param User
     */
    UpdateUser(updatedAccount: IUser, antiForgeryToken: string): ng.IPromise<void | boolean> {

        let params: any = {
            updatedAccount: updatedAccount
        };

        let config: ng.IRequestShortcutConfig = this.ConfigAntiForgery(antiForgeryToken);

        let onAccountUpdatedReturned: (response: ng.IHttpPromiseCallbackArg<boolean>) => boolean;
        onAccountUpdatedReturned = (response: ng.IHttpPromiseCallbackArg<boolean>) => {
            return <boolean>response.data;
        };

        return this.$http.post(`/Manage/UpdateAccount`, params, config).then(onAccountUpdatedReturned, this.onError);
    }

    /**
     * Get all of the users of the current application
     */
    ReadApplicationUsers(): ng.IPromise<any | Array<IUser>> {

        let onReadApplicationUsersCompleted: (response: ng.IHttpPromiseCallbackArg<Array<IUser>>) => Array<IUser> =
            (response: ng.IHttpPromiseCallbackArg<Array<IUser>>) => {
                return <Array<IUser>>response.data;
            };

        return this.$http.post(`${this.MangementEndPont}ReadIdentityUsers`, {},
                        this.ConfigSecureAppJson("", this.authService.GetLocalToken())).then(onReadApplicationUsersCompleted, this.onError);
    }

    /**
     * Update a user login.
     */
    UpdateUserLogin(UpdateLoginModel: LoginUpdate, antiForgeryToken: string): ng.IPromise<void | boolean> {

        let params:any = {
            updateLogin: UpdateLoginModel
        };

        let config: any = this.ConfigAntiForgery(antiForgeryToken);

        let onAccountUpdatedReturned: (response: ng.IHttpPromiseCallbackArg<boolean>) => boolean;
        onAccountUpdatedReturned = (response: ng.IHttpPromiseCallbackArg<boolean>) => {
            return <boolean>response.data;
        }

        return this.$http.post("/Manage/UpdateLogin", params, config).then(onAccountUpdatedReturned, this.onError);
    }

    // error handling callbacks
    private onError: (Error: any) => void;
}