import * as uirouter from "@uirouter/angularjs";
import { AdminController } from "Admin/admin.controller";
import { AdminService } from "Admin/admin.service";
import { IAuthEventConstants } from "Admin/Interfaces/IAuthEventConstants";
import { IHttpAdminRoutes } from "Admin/Interfaces/IHttpAdminRoutes";
import { LoginComponent, LoginComponentName } from "Admin/Login/login.component";
import { RegisterUserComponent, RegisterUserComponentName } from "Admin/Register/registerUser.component";
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
    private uiRouteConfig($stateProvider: ng.ui.IStateProvider,
        $urlRouterProvider: ng.ui.IUrlRouterProvider,
        RESOURCES: IResources,
        ACTIONS: IActions): void {

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

        let manageContentState: BlogState = {
            templateUrl: require("admin/manageContent.html"),
            controller: AdminController,
            controllerAs: "vm",
            authorize: true,
            action: ACTIONS.Read,
            resource: RESOURCES.Admin,
            authorizationResolver: null,
            name: "manageContent",
            url: "/manageContent"
        };


        $stateProvider.state(loginState);
        $stateProvider.state(manageContentState);
        $stateProvider.state(registerUserState);
    }

    /**
     * Configure all routes for this model
     * @param $routeProvider
     */
    private routeConfig($routeProvider: ng.route.IRouteProvider, RESOURCES: IResources, ACTIONS: IActions):void {

        try {

            // custom routes with security
            let logoffRoute: IRouteBlog = {
                templateUrl: require("admin/login/logoff.html"),
                caseInsensitiveMatch: true,
                controller: AdminController,
                controllerAs: "vm",
                authorize: true,
                action: ACTIONS.Read,
                resource: RESOURCES.Admin,
                authorizationResolver: null
            };

            let manageBlogRoute: IRouteBlog = {
                templateUrl: require("admin/manageContent.html"),
                caseInsensitiveMatch: true,
                controller: AdminController,
                controllerAs: "vm",
                authorize: true,
                action: ACTIONS.Read,
                resource: RESOURCES.Admin,
                authorizationResolver: null
            };

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

            let myAccountRoute: IRouteBlog = {
                templateUrl: require("admin/account/myAccount.html"),
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
                templateUrl: require("Admin/account/passwordUpdate.html"),
                caseInsensitiveMatch: true,
                controller: AdminController,
                controllerAs: "vm",
                authorize: true,
                action: ACTIONS.Read,
                resource: RESOURCES.Admin,
                authorizationResolver: null
            };

            let confirmPasswordUpdateRoute: IRouteBlog = {
                templateUrl: require("admin/account/passwordUpdateConfirmation.html"),
                caseInsensitiveMatch: true,
                controller: AdminController,
                controllerAs: "vm",
                authorize: true,
                action: ACTIONS.Read,
                resource: RESOURCES.Admin,
                authorizationResolver: null
            };

            let passwordResetRoute: IRouteBlog = {
                templateUrl: require("admin/account/passwordReset.html"),
                caseInsensitiveMatch: true,
                controller: AdminController,
                controllerAs: "vm",
                authorize: true,
                action: ACTIONS.Read,
                resource: RESOURCES.Admin,
                authorizationResolver: null
            };

            let passwordResetConfirmationRoute: IRouteBlog = {
                templateUrl: require("admin/Account/passwordResetConfirmation.html"),
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
                .when("/logoff", logoffRoute)
                .when("/manageContent", manageBlogRoute)
                .when("/accounts", accountsRoute)
                .when("/myAccount", myAccountRoute)
                .when("/updateAccount", accountUpdate)
                .when("/passwordReset", passwordResetRoute)
                .when("/passwordUpdate", passwordUpdateRoute)
                .when("/passwordResetConfirmation", confirmPasswordUpdateRoute)
                .when("/loginUpdate", loginUpdateRoute)
                .when("/loginUpdateConfirmation", loginUpdateConfirmationRoute)
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
            MyAccount: "/Account/MyAccount",
            ReadApplicationUsers: "/Manage/ReadIdentityUsers",
            RegisterNewUser: "/Account/Register",
            Login: "/Authentication/Login",
            UpdatePassword: "/Manage/ChangePassword",
            UpdateUser: `/Manage/UpdateAccount`,
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
Admin.AddComponent(RegisterUserComponentName, new RegisterUserComponent())