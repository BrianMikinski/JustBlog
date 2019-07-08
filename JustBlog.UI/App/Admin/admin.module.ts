import * as uirouter from "@uirouter/angularjs";
import { AdminController } from "admin/admin.controller";
import { AdminService } from "admin/admin.service";
import { IAdminRoutes } from "admin/interfaces/IAdminRoutes";
import { IAuthEventConstants } from "admin/interfaces/IAuthEventConstants";
import { LoginComponent, LoginComponentName } from "admin/login/login.component";
import { RegisterUserComponent, RegisterUserComponentName } from "admin/register/registerUser.component";
import * as angular from "angular";
import * as ngAnimate from "angular-animate";
import * as ngSantize from "angular-sanitize";
import { AuthService } from "core/authorization/auth.service";
import { IAction } from "core/authorization/IAction";
import { IBlogRoute } from "core/authorization/IBlogRoute";
import { IResource } from "core/authorization/IResource";
import { BaseModule } from "core/models/BaseModule";
import { MyAccountComponent, MyAccountComponentName } from "./account/myAcccount.component";
import { AdminHeaderComponent, AdminHeaderComponentName } from "./adminHeader.component";
import { LogoffComponent, LogoffComponentName } from "./Login/logoff.component";
import { ForgotPasswordComponent, ForgotPasswordComponentName } from "./password/forgotPassword.component";
import { ResetPasswordComponent, ResetPasswordComponentName } from "./password/resetpassword.component";
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
    private uiRouteConfig($stateProvider: ng.ui.IStateProvider, RESOURCES: IResource, ACTIONS: IAction): void {

        let loginState: ng.ui.IState = {
            name: "login",
            component: LoginComponentName,
            url: "/login",
        };

        let registerUserState: ng.ui.IState = {
            name: "register",
            component: RegisterUserComponentName,
            url: "/register"
        };

        let myAccountState: ng.ui.IState = {
            name: "myAccount",
            component: MyAccountComponentName,
            url: "/myAccount",
            resolve: {
                account: ["adminService", (adminService: AdminService) => {
                    return adminService.myAccount();
                }]
            },
            protected: true
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

        let manageContentState: ng.ui.IState = {
            name: "manageContent",
            url: "/manageContent",
            templateUrl: require("admin/manageContent.html"),
            controller: AdminController,
            controllerAs: "vm",
            protected: true
        };

        let logoffState: ng.ui.IState = {
            name: "logoff",
            url: "/logoff",
            component: LogoffComponentName,
            protected: true
        };

        let forgotPasswordState: ng.ui.IState = {
            name: "forgotPassword",
            url: "/forgotPassword",
            component: ForgotPasswordComponentName
        };

        let resetPasswordState: ng.ui.IState = {
            name: "resetPassword",
            url: "/resetPassword?email&code",
            component: ResetPasswordComponentName,
            resolve: {
                email: ["$state", ($state: ng.ui.IStateService) => {
                    return $state.params.email;
                }],
                code: ["$state", ($state: ng.ui.IStateService) => {
                    return $state.params.code;
                }]
            }
        };

        $stateProvider.state(loginState);
        $stateProvider.state(manageContentState);
        $stateProvider.state(registerUserState);
        $stateProvider.state(logoffState);
        $stateProvider.state(confirmEmailState);
        $stateProvider.state(myAccountState);
        $stateProvider.state(forgotPasswordState);
        $stateProvider.state(resetPasswordState);
    }

    /**
     * Configure all routes for this model
     * @param $routeProvider
     */
    private routeConfig($routeProvider: ng.route.IRouteProvider, RESOURCES: IResource, ACTIONS: IAction):void {

        try {

            let accountsRoute: IBlogRoute = {
                templateUrl: require("admin/account/accounts.html"),
                caseInsensitiveMatch: true,
                controller: AdminController,
                controllerAs: "vm",
                authorize: true,
                action: ACTIONS.Read,
                resource: RESOURCES.Admin,
                authorizationResolver: null
            };

            let passwordUpdateRoute: IBlogRoute = {
                templateUrl: require("Admin/password/passwordUpdate.html"),
                caseInsensitiveMatch: true,
                controller: AdminController,
                controllerAs: "vm",
                authorize: true,
                action: ACTIONS.Read,
                resource: RESOURCES.Admin,
                authorizationResolver: null
            };

            let confirmPasswordUpdateRoute: IBlogRoute = {
                templateUrl: require("admin/password/passwordUpdateConfirmation.html"),
                caseInsensitiveMatch: true,
                controller: AdminController,
                controllerAs: "vm",
                authorize: true,
                action: ACTIONS.Read,
                resource: RESOURCES.Admin,
                authorizationResolver: null
            };

            let passwordResetConfirmationRoute: IBlogRoute = {
                templateUrl: require("admin/password/passwordResetConfirmation.html"),
                caseInsensitiveMatch: true,
                controller: AdminController,
                controllerAs: "vm",
                authorize: true,
                action: ACTIONS.Read,
                resource: RESOURCES.Admin,
                authorizationResolver: null
            };

            let loginUpdateRoute: IBlogRoute = {
                templateUrl: require("admin/login/loginUpdate.html"),
                caseInsensitiveMatch: true,
                controller: AdminController,
                controllerAs: "vm",
                authorize: true,
                action: ACTIONS.Read,
                resource: RESOURCES.Admin,
                authorizationResolver: null
            };

            let loginUpdateConfirmationRoute: IBlogRoute = {
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
    public static HttpAdminServiceRoutes(): IAdminRoutes {

        const resources: IAdminRoutes = {
            ContentManagement: "",
            DeleteUser: "",
            ResetPassword: "api/Account/ResetPassword",
            RequestPasswordReset: "api/Account/RequestPasswordReset",
            ForgotPasswordUpdateAccount: "",
            Logoff: "/Authentication/Logout",
            MyAccount: "api/Account/MyAccount",
            ReadApplicationUsers: "/Manage/ReadIdentityUsers",
            RegisterNewUser: "api/Account/Register",
            ConfirmEmail: "api/Account/ConfirmEmail",
            Login: "/Authentication/Login",
            UpdatePassword: "/Manage/ChangePassword",
            UpdateUser: `api/account/UpdateAccount`,
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

adminFactory.$inject = ["$rootScope", "$http", "authService", "ADMIN_ROUTE_CONSTANTS", "AUTH_EVENT_CONSTANTS"];
function adminFactory($rootScope: ng.IRootScopeService,
                        $http: ng.IHttpService,
                        authService: AuthService,
                        ADMIN_ROUTE_CONSTANTS: IAdminRoutes,
                        AUTH_EVENT_CONSTANTS: IAuthEventConstants): AdminService {
    return new AdminService($rootScope, $http, authService, ADMIN_ROUTE_CONSTANTS, AUTH_EVENT_CONSTANTS);
}

Admin.AddController("Admin", AdminController as ng.Injectable<angular.IControllerConstructor>);
Admin.AddComponent(LoginComponentName, new LoginComponent())
Admin.AddComponent(LogoffComponentName, new LogoffComponent());
Admin.AddComponent(RegisterUserComponentName, new RegisterUserComponent())
Admin.AddComponent(AdminHeaderComponentName, new AdminHeaderComponent());
Admin.AddComponent(ConfirmEmailComponentName, new ConfirmEmailComponent());
Admin.AddComponent(MyAccountComponentName, new MyAccountComponent());
Admin.AddComponent(ForgotPasswordComponentName, new ForgotPasswordComponent());
Admin.AddComponent(ResetPasswordComponentName, new ResetPasswordComponent());