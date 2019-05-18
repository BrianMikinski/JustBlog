import * as uirouter from "@uirouter/angularjs";
import { HookMatchCriteria, HookResult, Transition, TransitionHookFn, TransitionService } from "@uirouter/angularjs";
import { LoginComponentName } from "admin/login/login.component";
import * as angular from "angular";
import { AuthorizationDirective } from "Core/auth.directive";
import { AuthInterceptor } from "Core/auth.interceptor";
import { AuthService } from "Core/auth.service";
import { CoreService, ICoreService } from "Core/core.service";
import { IAuthenticationConstants } from "Core/Interfaces/IAuthenticationConstants";
import { IHttpAuthRoutes } from "Core/Interfaces/IHttpAuthRoutes";
import { BaseModule } from "Core/Models/BaseModule";
import { RouteAuthorizationError } from "Core/Models/RouteAuthorizationError";

const moduleName: string = "app.core";
export default moduleName;

export class CoreModule extends BaseModule {

    constructor() {
        super();

        this.moduleName = moduleName;
        this.moduleDependencies = [uirouter.default];

        // must set our constants before passing them to the config controller
        this.app = angular.module(this.moduleName, this.moduleDependencies);
        this.app.constant("AUTHENTICATION_CONSTANTS", this.AuthenticationConstants());

        this.app.constant("RESOURCES", this.ResourceConstants());
        this.app.constant("ACTIONS", this.ActionConstants());
        this.app.constant(this.authRouteConstants, CoreModule.HttpAuthServiceRoutes());

        this.app.directive("isAuthorized", AuthorizationDirective.Factory());

        // configure auth
        this.app.run(this.StateTransitions);

        // add the auth interceptor config to the main module.
        // this allows us to do site wide authentication.
        this.app.config(this.authInterceptorConfig);

        this.app.config(this.locationProviderConfig);
    }

    /**
    * Setup a state authorization handler. This is required in tandem with the route state authorization
    * handler while transitioning to angular ui router
    * @param $rootScope
    * @param $location
    */
    StateTransitions($rootScope: ng.IRootScopeService, $transitions: TransitionService, $location: ng.ILocationService, authService: AuthService) {

        // authentication
        let authenticationHookCriteria: HookMatchCriteria = {
            to: "*"
        };

        let startTransitionAuthHookFunction: TransitionHookFn = (transition: Transition): HookResult => {

            let toState: ng.ui.IState = <any>transition.to();

            if (toState.protected === true && !authService.GetLocalToken()) {
                return transition.router.stateService.target(LoginComponentName);
            }
        };

        $transitions.onStart(authenticationHookCriteria, startTransitionAuthHookFunction);

        // authentication errors
        let stateTransitionErrorHookFunction: TransitionHookFn = (transition: Transition): HookResult => {

            let fromState: ng.ui.IState = <any>transition.from();
            let toState: ng.ui.IState = <any>transition.to();
            let error: any = transition.error();

            console.log(`State change ERROR from "${fromState}" to "${toState}".`, error);
            if (error instanceof RouteAuthorizationError) {
                console.log("Redirecting to access denied page...");

                $location.path("/unauthorized");
            }
        };

        $transitions.onError(authenticationHookCriteria, stateTransitionErrorHookFunction);

        // authentication sucess
        let stateTransitionSuccessHookFn: TransitionHookFn = (transition: Transition): HookResult => {

            let fromState: ng.ui.IState = <any>transition.from();
            let toState: ng.ui.IState = <any>transition.to();

            //console.log(`State change success from "${fromState.url}" to "${toState.url}"`);
        };

        $transitions.onSuccess(authenticationHookCriteria, stateTransitionSuccessHookFn);
    }

    /**
     * Authentication config
     * @param $httpProvider
     */
    private authInterceptorConfig($httpProvider: ng.IHttpProvider): void {
        $httpProvider.interceptors.push("authInterceptor");
    }

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
    public static HttpAuthServiceRoutes(): IHttpAuthRoutes {

        const resources: IHttpAuthRoutes = {
            AntiForgeryToken: "Verification/GenerateAntiForgeryToken"
        }

        return resources;
    }
}

/**
 * Module Setup - Instantiating all module services and controllers
 */
let Core: CoreModule = new CoreModule();

Core.AddFactory("coreService", coreService);

coreService.$inject = ["$http"];
function coreService($http: ng.IHttpService): ICoreService {
    "use strict";
    return new CoreService($http);
}

Core.AddFactory("authService", authService);

authService.$inject = ["$http", "$q", "AUTHENTICATION_CONSTANTS", "AUTH_ROUTE_CONSTANTS"];
function authService($http: ng.IHttpService, $q: ng.IQService, AUTHENTICATION_CONSTANTS: IAuthenticationConstants,
    AUTH_ROUTE_CONSTANTS: IHttpAuthRoutes): AuthService {
    return new AuthService($http, $q, AUTHENTICATION_CONSTANTS, AUTH_ROUTE_CONSTANTS);
}

Core.AddService("authInterceptor", authInterceptor);

authInterceptor.$inject = ["$rootScope", "$q", "AUTHENTICATION_CONSTANTS"];
function authInterceptor($rootScope: ng.IRootScopeService, $q: ng.IQService, AUTHENTICATION_CONSTANTS: IAuthenticationConstants): AuthInterceptor {
    return new AuthInterceptor($rootScope, $q, AUTHENTICATION_CONSTANTS);
}