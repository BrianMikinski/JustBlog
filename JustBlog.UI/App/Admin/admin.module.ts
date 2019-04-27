import * as uirouter from "@uirouter/angularjs";
import { AdminController } from "admin/admin.controller";
import { AdminService } from "admin/admin.service";
import { IAuthEventConstants } from "admin/interfaces/IAuthEventConstants";
import { IHttpAdminRoutes } from "admin/interfaces/IHttpAdminRoutes";
import { LoginComponent, LoginComponentName } from "admin/login/login.component";
import { RegisterUserComponent, RegisterUserComponentName } from "admin/register/registerUser.component";
import * as angular from "angular";
import * as ngAnimate from "angular-animate";
import * as ngSantize from "angular-sanitize";
import { AuthService } from "Core/auth.service";
import { IActions } from "Core/Interfaces/IActions";
import { IAuthenticationConstants } from "Core/Interfaces/IAuthenticationConstants";
import { IResources } from "Core/Interfaces/IResources";
import { IRouteBlog } from "Core/Interfaces/IRouteBlog";
import { BaseModule } from "Core/Models/BaseModule";
import { BlogState } from "Core/Models/BlogState";
import { MyAccountComponent, MyAccountComponentName } from "./account/myAcccount.component";
import { AdminHeaderComponent, AdminHeaderComponentName } from "./adminHeader.component";
import { LogoffComponent, LogoffComponentName } from "./Login/logoff.component";
import { ConfirmEmailComponent, ConfirmEmailComponentName } from "./register/confirmEmail.component";

/**
 * Angular ui bootstrap does not define a default export so typescript elides the
 * import. Therefore we just require it to make sure webpack defines it as a dependency
 */
require("angular-ui-bootstrap");
const angularUIBootstrapModule: string = "ui.bootstrap";

const moduleName: string = "app.admin";
export default moduleName;

/**
 * Class for setting up the admin module
 */
export class AdminModule extends BaseModule {

    constructor() {
        super();

        this.moduleName = moduleName;
        this.moduleDependencies = [ngAnimate, ngSantize, uirouter.default, angularUIBootstrapModule];

        this.app = angular.module(this.moduleName, this.moduleDependencies);
        this.app.constant(this.adminRouteConstants, AdminModule.HttpAdminServiceRoutes());
        this.app.constant(this.authEventConstants, AdminModule.AuthEventConstants());

        this.app.config(this.uiRouteConfig);
        this.app.config(this.locationProviderConfig);
    }

    /**
     * Configure routes based on UI router
     * @param $stateProvider
     * @param $urlRouterProvider
     */
    private uiRouteConfig($stateProvider: ng.ui.IStateProvider, RESOURCES: IResources, ACTIONS: IActions): void {

        let loginState: ng.ui.IState = {
            name: "login",
            component: LoginComponentName,
            url: "/login",
        };

        let registerUserState: ng.ui.IState = {
            name: "register",
            component: RegisterUserComponentName,
            url: "/register",
        };

        let myAccountState: ng.ui.IState = {
            name: "myAccount",
            component: MyAccountComponentName,
            url: "/myAccount",
            resolve: {
                account: ["adminService", (adminService: AdminService) => {
                    return adminService.myAccount();
                }]
            }
        };

        let confirmEmailState: ng.ui.IState = {
            name: "confirmEmail",
            component: ConfirmEmailComponentName,
            url: "/confirmEmail?userId&code",
            resolve: {
                userId: ["$state", ($state: ng.ui.IStateService) => {
                    return $state.params.userId;
                }],
                code: ["$state", ($state: ng.ui.IStateService) => {
                    return $state.params.code;
                }]
            }
        };

        let manageContentState: BlogState = {
            name: "manageContent",
            url: "/manageContent",
            templateUrl: require("admin/manageContent.html"),
            controller: AdminController,
            controllerAs: "vm",
            authorize: true,
            action: ACTIONS.Read,
            resource: RESOURCES.Admin,
            authorizationResolver: null,
        };

        let logoffState: BlogState = {
            name: "logoff",
            url: "/logoff",
            component: LogoffComponentName,
            authorize: true,
            action: ACTIONS.Read,
            resource: RESOURCES.Admin,
            authorizationResolver: null,
        };

        $stateProvider.state(loginState);
        $stateProvider.state(manageContentState);
        $stateProvider.state(registerUserState);
        $stateProvider.state(logoffState);
        $stateProvider.state(confirmEmailState);
        $stateProvider.state(myAccountState);
    }

    /**
     * Configure all routes for this model
     * @param $routeProvider
     */
    private routeConfig($routeProvider: ng.route.IRouteProvider, RESOURCES: IResources, ACTIONS: IActions):void {

        try {

            let accountsRoute: IRouteBlog = {
                templateUrl: require("admin/account/accounts.html"),
                caseInsensitiveMatch: true,
                controller: AdminController,
                controllerAs: "vm",
                authorize: true,
                action: ACTIONS.Read,
                resource: RESOURCES.Admin,
                authorizationResolver: null
            };

            let accountUpdate: IRouteBlog = {
                templateUrl: require("admin/account/update.html"),
                caseInsensitiveMatch: true,
                controller: AdminController,
                controllerAs: "vm",
                authorize: true,
                action: ACTIONS.Read,
                resource: RESOURCES.Admin,
                authorizationResolver: null
            };

            let passwordUpdateRoute: IRouteBlog = {
                templateUrl: require("Admin/password/passwordUpdate.html"),
                caseInsensitiveMatch: true,
                controller: AdminController,
                controllerAs: "vm",
                authorize: true,
                action: ACTIONS.Read,
                resource: RESOURCES.Admin,
                authorizationResolver: null
            };

            let confirmPasswordUpdateRoute: IRouteBlog = {
                templateUrl: require("admin/password/passwordUpdateConfirmation.html"),
                caseInsensitiveMatch: true,
                controller: AdminController,
                controllerAs: "vm",
                authorize: true,
                action: ACTIONS.Read,
                resource: RESOURCES.Admin,
                authorizationResolver: null
            };

            let passwordResetRoute: IRouteBlog = {
                templateUrl: require("admin/password/passwordReset.html"),
                caseInsensitiveMatch: true,
                controller: AdminController,
                controllerAs: "vm",
                authorize: true,
                action: ACTIONS.Read,
                resource: RESOURCES.Admin,
                authorizationResolver: null
            };

            let passwordResetConfirmationRoute: IRouteBlog = {
                templateUrl: require("admin/password/passwordResetConfirmation.html"),
                caseInsensitiveMatch: true,
                controller: AdminController,
                controllerAs: "vm",
                authorize: true,
                action: ACTIONS.Read,
                resource: RESOURCES.Admin,
                authorizationResolver: null
            };

            let loginUpdateRoute: IRouteBlog = {
                templateUrl: require("admin/login/loginUpdate.html"),
                caseInsensitiveMatch: true,
                controller: AdminController,
                controllerAs: "vm",
                authorize: true,
                action: ACTIONS.Read,
                resource: RESOURCES.Admin,
                authorizationResolver: null
            };

            let loginUpdateConfirmationRoute: IRouteBlog = {
                templateUrl: require("admin/login/loginUpdateConfirmation.html"),
                caseInsensitiveMatch: true,
                controller: AdminController,
                controllerAs: "vm",
                authorize: true,
                action: ACTIONS.Read,
                resource: RESOURCES.Admin,
                authorizationResolver: null
            };

            $routeProvider
                .when("/accounts", accountsRoute)
                .when("/updateAccount", accountUpdate)
                .when("/passwordReset", passwordResetRoute)
                .when("/passwordUpdate", passwordUpdateRoute)
                .when("/passwordResetConfirmation", confirmPasswordUpdateRoute)
                .when("/loginUpdate", loginUpdateRoute)
                .when("/loginUpdateConfirmation", loginUpdateConfirmationRoute);

        } catch (error) {
            console.log(error.message);
        }
    };

    /**
     * Configure the location provider to be in html5 mode
     * @param $locationProvider
     */
    private locationProviderConfig($locationProvider: ng.ILocationProvider): void {
        $locationProvider.html5Mode(true);
    };

    /**
     * Set auth service routes
     */
    public static HttpAdminServiceRoutes(): IHttpAdminRoutes {

        const resources: IHttpAdminRoutes = {
            ContentManagement: "",
            DeleteUser: "",
            ForgotPassword: "/Submit/Login",
            ForgotPasswordUpdateAccount: "",
            Logoff: "/Authentication/Logout",
            MyAccount: "api/Account/MyAccount",
            ReadApplicationUsers: "/Manage/ReadIdentityUsers",
            RegisterNewUser: "api/Account/Register",
            ConfirmEmail: "api/Account/ConfirmEmail",
            Login: "/Authentication/Login",
            UpdatePassword: "/Manage/ChangePassword",
            UpdateUser: `api/Manage/UpdateAccount`,
            UpdateUserLogin: "/Manage/UpdateLogin",
        }

        return resources;
    }

    /**
     * Add any auth event constants
     */
    public static AuthEventConstants(): IAuthEventConstants {

        const resources: IAuthEventConstants = {
            loginSuccess: "auth-login-success",
            loginFailed: "auth-login-failed",
            logoutSuccess: "auth-logout-success",
            sessionTimeout: "auth-session-timeout",
            notAuthenticated: "auth-not-authenticated",
            notAuthorized: "auth-not-authorized"
        };

        return resources;
    }
}

// create the module
let Admin:AdminModule = new AdminModule();

Admin.AddFactory("adminService", adminFactory);

adminFactory.$inject = ["$rootScope", "$http", "authService", "AUTHENTICATION_CONSTANTS", "ADMIN_ROUTE_CONSTANTS", "AUTH_EVENT_CONSTANTS"];
function adminFactory($rootScope: ng.IRootScopeService,
                        $http: ng.IHttpService,
                        authService: AuthService,
                        AUTHENTICATION_CONSTANTS: IAuthenticationConstants,
                        ADMIN_ROUTE_CONSTANTS: IHttpAdminRoutes,
                        AUTH_EVENT_CONSTANTS: IAuthEventConstants): AdminService {
    "use strict";
    return new AdminService($rootScope, $http, authService, AUTHENTICATION_CONSTANTS, ADMIN_ROUTE_CONSTANTS, AUTH_EVENT_CONSTANTS);
}

Admin.AddController("Admin", AdminController as ng.Injectable<angular.IControllerConstructor>);
Admin.AddComponent(LoginComponentName, new LoginComponent())
Admin.AddComponent(LogoffComponentName, new LogoffComponent());
Admin.AddComponent(RegisterUserComponentName, new RegisterUserComponent())
Admin.AddComponent(AdminHeaderComponentName, new AdminHeaderComponent());
Admin.AddComponent(ConfirmEmailComponentName, new ConfirmEmailComponent());
Admin.AddComponent(MyAccountComponentName, new MyAccountComponent());