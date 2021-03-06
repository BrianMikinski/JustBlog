﻿import { TokenAuthResponse } from "admin/account/TokenAuthResponse";
import { User } from "admin/account/User";
import { AdminRoutes } from "admin/interfaces/AdminRoutes";
import { AuthEvent } from "admin/interfaces/AuthEvent";
import { LoginModel } from "admin/login/LoginModel";
import { LoginUpdate } from "admin/login/LoginUpdate";
import { RegistrationAttempt } from "admin/register/RegistrationAttempt";
import { RegistrationUser } from "admin/register/RegistrationUser";
import { AuthService } from "core/authorization/auth.service";
import { BaseService } from "core/models/BaseService";
import { ChangePasswordModel } from "./password/ChangePasswordModel";
import { ResetPasswordModel } from "./password/ResetPasswordModel";
import { ValidPassword } from "./password/ValidPassword";

export const AdminServiceName: string = "adminService";

//Admin service class that allows users to perform common account management actions
export class AdminService extends BaseService {

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
    static $inject = ["$rootScope", "$http", "authService", "ADMIN_ROUTE_CONSTANTS", "AUTH_EVENT_CONSTANTS"];
    constructor(private $rootScope: ng.IRootScopeService,
        private $http: ng.IHttpService,
        private authService: AuthService,
        private AUTH_ROUTE_CONSTANTS: AdminRoutes,
        private AUTH_EVENT_CONSTANTS: AuthEvent) {
        super();

        this.SetErrorMessage("An error was encountered in the admin service");
    }

    /**
     * Get all registered users
     */
    users(): ng.IPromise<void | Array<User>> {

        // defining callback within function
        let onDataReturned: (response: ng.IHttpResponse<Array<User>>) => Array<User>;
        onDataReturned = (response: ng.IHttpResponse<Array<User>>) => {
            return <Array<User>>JSON.parse(<any>response.data);
        };

        return this.$http.post("/manage/ReadIdentityUsers", null).then(onDataReturned, this.onError);
    }

    /**
     * Register a new account
     * @param newUser
     * @param antiForgeryToken
     */
    registerUser(newUser: RegistrationUser): ng.IPromise<void | RegistrationAttempt> {

        let params = {
            model: newUser,
            returnUrl: ""
        };

        let onRegistrationCallback: (response: ng.IHttpResponse<RegistrationAttempt>) => RegistrationAttempt;
        onRegistrationCallback = (response: ng.IHttpResponse<RegistrationAttempt>) => {
            return <RegistrationAttempt>response.data;
        };

        return this.$http.post(`${this.AUTH_ROUTE_CONSTANTS.RegisterNewUser}`,
            this.SerializeToQueryStringParams(params, null), this.httpPostConfig)
            .then(onRegistrationCallback, this.onError);
    }

    /**
     * Start email confirmation
     * */
    initiateEmailConfirmation(): ng.IPromise<void> {

        let onInitiateEmailConfirmationCallback: (response: ng.IHttpResponse<{}>) => void;
        onInitiateEmailConfirmationCallback = (response: ng.IHttpResponse<{}>) => {
            
        };

        return this.$http.post(`${this.AUTH_ROUTE_CONSTANTS.ConfirmEmail}`, null)
            .then(onInitiateEmailConfirmationCallback, this.onError);
    }

    /**
     * Confirm user email
     * @param userId the users unique identifier
     * @param userCode the users unique code
     */
    confirmUserEmail(userId: string, userCode: string): ng.IPromise<void> {

        let onConfirmEmailCallback: (response: ng.IHttpResponse<any>) => any;
        onConfirmEmailCallback = (response: ng.IHttpResponse<any>) => {
            return response.data;
        };

        return this.$http.get(`${this.AUTH_ROUTE_CONSTANTS.ConfirmEmail}?userId=${userId}&code=${userCode}`)
            .then(onConfirmEmailCallback, this.onError);
    }

    /**
     * Remove an account
     * @param userGUID
     */
    deleteUser(userGUID: string): ng.IPromise<boolean> {
        throw new Error("Not Implemented");
    }

    /**
     * Change a users password
     * @param user
     * @param antiForgeryToken
     */
    updatePassword(updatePasswordModel: ChangePasswordModel, antiForgeryToken: string): ng.IPromise<void | boolean> {
        //Add headers for anti forgery token
        let config: ng.IRequestShortcutConfig = this.ConfigAntiForgery(antiForgeryToken);

        let onUpdatePasswordCallback: (response: ng.IHttpResponse<boolean>) => boolean;
        onUpdatePasswordCallback = (response: ng.IHttpResponse<boolean>) => {
            return <boolean>response.data;
        };

        return this.$http.post("/Manage/ChangePassword", updatePasswordModel, config).then(onUpdatePasswordCallback, this.onError);
    }

    /**
     * Submit a user's email address for password reset
     * @param emailAddress
     * @param antiForgeryToken
     */
    requestPasswordReset(emailAddress: string): ng.IPromise<void> {

        //Add headers for anti forgery token
        let onRequestPasswordReset: (response: ng.IHttpResponse<any>) => void;
        onRequestPasswordReset = (response: ng.IHttpResponse<any>) => {
            
        };

        let userForgottenEmail = {
            Email: emailAddress
        };

        return this.$http.post(this.AUTH_ROUTE_CONSTANTS.RequestPasswordReset, userForgottenEmail)
            .then(onRequestPasswordReset, this.onError);
    }

    /**
     * Service for updating a forgotten password
     * @param resetPasswordModel
     */
    resetPassword(resetPasswordModel: ResetPasswordModel): ng.IPromise<void> {

        //Add headers for anti forgery token
        let onRequestPasswordReset: (response: ng.IHttpResponse<any>) => void;
        onRequestPasswordReset = (response: ng.IHttpResponse<any>) => {
            
        };

        return this.$http.post(this.AUTH_ROUTE_CONSTANTS.ResetPassword, resetPasswordModel)
            .then(onRequestPasswordReset);
    }

    /**
     * Login a user
     * @param loginModel
     * @param antiForgeryToken
     */
    login(loginModel: LoginModel): ng.IPromise<void | TokenAuthResponse> {

        let onLoginCallback: (response: ng.IHttpResponse<TokenAuthResponse>) => TokenAuthResponse;
        onLoginCallback = (response: ng.IHttpResponse<TokenAuthResponse>) => {

            if (response.status === 200) {

                let authResponse: TokenAuthResponse = response.data;
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
    logOff(): ng.IPromise<void> {

        let onLogoffCallback: () => void;
        onLogoffCallback = () => {

            this.authService.DestroyUserTokens();

            // false here so that we let event handlers know we're not logged-in anymore
            this.$rootScope.$broadcast(this.AUTH_EVENT_CONSTANTS.logoutSuccess, false);
        };

        return this.$http.post(`${this.AUTH_ROUTE_CONSTANTS.Logoff}`, null)
            .then(onLogoffCallback, this.onError);
    }

    /**
     * Get the currently logged in users account information
     */
    myAccount(): ng.IPromise<void | User> {

        let onMyAccountCallback: (response: ng.IHttpResponse<User>) => User;

        onMyAccountCallback = (response: ng.IHttpResponse<User>) => {
            return response.data;
        };

        return this.$http.get(this.AUTH_ROUTE_CONSTANTS.MyAccount)
            .then(onMyAccountCallback, this.onError);
    }

    /**
     * Update a user account
     * @param user
     */
    updateAccount(user: User): ng.IPromise<void | User> {

        let data: any = {
            user: user
        };

        let onAccountUpdatedReturned: (response: ng.IHttpResponse<User>) => User;
        onAccountUpdatedReturned = (response: ng.IHttpResponse<User>) => {
            return response.data;
        };

        return this.$http.put(this.AUTH_ROUTE_CONSTANTS.UpdateUser, user)
            .then(onAccountUpdatedReturned, this.onError);
    }

    /**
     * Get all of the users of the current application
     */
    readApplicationUsers(): ng.IPromise<any | Array<User>> {

        let onReadApplicationUsersCompleted: (response: ng.IHttpResponse<Array<User>>) => Array<User> =
            (response: ng.IHttpResponse<Array<User>>) => {
                return <Array<User>>response.data;
            };

        return this.$http.post(`/manage/readIdentityUsers`, null).then(onReadApplicationUsersCompleted, this.onError);
    }

    /**
     * Update a user login.
     */
    updateUserLogin(UpdateLoginModel: LoginUpdate, antiForgeryToken: string): ng.IPromise<void | boolean> {

        let params: any = {
            updateLogin: UpdateLoginModel
        };

        let config: any = this.ConfigAntiForgery(antiForgeryToken);

        let onAccountUpdatedReturned: (response: ng.IHttpResponse<boolean>) => boolean;
        onAccountUpdatedReturned = (response: ng.IHttpResponse<boolean>) => {
            return <boolean>response.data;
        }

        return this.$http.post("/Manage/UpdateLogin", params, config)
            .then(onAccountUpdatedReturned, this.onError);
    }

    passwordValidation(password: string): ValidPassword {

        let validPassword: ValidPassword = {
            has6Characters: false,
            hasLowerCase: false,
            hasNonAlphaNumeric: false,
            hasUpperCase: false,
            hasNumeric: false,
            isValidPassword: false
        };

        var hasNonAlphaNumericRegex = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g;
        var hasNumericRegex = /\d/;

        if (password !== undefined && password.length > 0) {

            validPassword.has6Characters = password.length >= 6;
            validPassword.hasLowerCase = password.toUpperCase() != password;
            validPassword.hasUpperCase = password.toLowerCase() != password;
            validPassword.hasNonAlphaNumeric = hasNonAlphaNumericRegex.test(password);
            validPassword.hasNumeric = hasNumericRegex.test(password);
        }

        let validPasswordChecks: number = 0;

        if (validPassword.has6Characters === true) {
            validPasswordChecks++;
        }

        if (validPassword.hasLowerCase === true) {
            validPasswordChecks++;
        }

        if (validPassword.hasUpperCase === true) {
            validPasswordChecks++;
        }

        if (validPassword.hasNonAlphaNumeric === true) {
            validPasswordChecks++
        }

        if (validPassword.hasNumeric === true) {
            validPasswordChecks++
        }

        if (validPasswordChecks > 3) {
            validPassword.isValidPassword = true;
        }

        return validPassword;
    }

    // error handling callbacks
    private onError: (Error: any) => void = (Error: any) => {
        console.log(Error);
    };
}