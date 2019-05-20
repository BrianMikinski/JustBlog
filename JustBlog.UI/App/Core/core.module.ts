import * as uirouter from "@uirouter/angularjs";
import { HookMatchCriteria, HookResult, StateService, Transition, TransitionHookFn, TransitionService } from "@uirouter/angularjs";
import { LoginComponentName } from "admin/login/login.component";
import * as angular from "angular";
import { AuthorizationDirective } from "Core/authorization/auth.directive";
import { AuthInterceptor } from "Core/authorization/auth.interceptor";
import { AuthService } from "Core/authorization/auth.service";
import { RouteAuthorizationError } from "Core/authorization/RouteAuthorizationError";
import { CoreService } from "Core/core.service";
import { BaseModule } from "Core/Models/BaseModule";
import { AuthenticationConstants } from "./authorization/AuthenticationConstants";
import { ErrorHandlingComponent, ErrorHandlingComponentName } from "./errorHandling/errorHandling.component";
import { ErrorRoutes } from "./errorHandling/ErrorRoutes";
import { ErrorHandlingService } from "./errorHandling/errorHandling.service";

const moduleName: string = "app.core";
export default moduleName;

export class CoreModule extends BaseModule {

    constructor() {
        super();

        this.moduleName = moduleName;
        this.moduleDependencies = [uirouter.default];

        // must set our constants before passing them to the config controller
        this.app = angular.module(this.moduleName, this.moduleDependencies);

        this.app.constant("RESOURCES", this.ResourceConstants());
        this.app.constant("ACTIONS", this.ActionConstants());

        let authConstants: AuthenticationConstants = {
            AuthToken: "JustBlogToken",
            AuthTokenValue: "JustBlog_Authenticated",
            UserName: ""
        };

        this.app.constant("AUTHENTICATION_CONSTANTS", authConstants)

        let errorRoutes: ErrorRoutes = {
            BadRequest400: "api/BadRequestTest",
            Unauthorized401: "api/UnauthorizedTest",
            NotFound404: "api/NotFoundTest",
            InternalServerError500: "api/InternalServerErrorTest",
        }

        this.app.constant("ERROR_ROUTES", errorRoutes)

        this.app.directive("isAuthorized", AuthorizationDirective.Factory());

        // configure auth
        this.app.run(this.StateTransitions);

        // add the auth interceptor config to the main module.
        // this allows us to do site wide authentication.
        this.app.config(this.authInterceptorConfig);

        this.app.config(this.locationProviderConfig);

        this.app.config(this.uiRouteConfig);
    }


    /**
     * Configure routes
     * @param $stateProvider
     */
    private uiRouteConfig($stateProvider: ng.ui.IStateProvider): void {
        let errorHandling: ng.ui.IState = {
            name: "error",
            url: "/error",
            component: ErrorHandlingComponentName
        };

        $stateProvider.state(errorHandling);
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
}

/**
 * Module Setup - Instantiating all module services and controllers
 */
let Core: CoreModule = new CoreModule();

Core.AddFactory("coreService", coreService);

coreService.$inject = ["$http"];
function coreService($http: ng.IHttpService): CoreService {
    "use strict";
    return new CoreService($http);
}

Core.AddFactory("authService", authService);

authService.$inject = ["$http", "$q", "AUTHENTICATION_CONSTANTS"];
function authService($http: ng.IHttpService, $q: ng.IQService, AUTHENTICATION_CONSTANTS: AuthenticationConstants): AuthService {
    return new AuthService($http, $q, AUTHENTICATION_CONSTANTS);
}

Core.AddService("authInterceptor", authInterceptor);

authInterceptor.$inject = ["$q", "$state", "AUTHENTICATION_CONSTANTS"];
function authInterceptor($q: ng.IQService, $state: StateService,  AUTHENTICATION_CONSTANTS: AuthenticationConstants): AuthInterceptor {
    return new AuthInterceptor($q, $state, AUTHENTICATION_CONSTANTS);
}

Core.AddService("errorHandlingService", errorHandlingService);

function errorHandlingService($http: ng.IHttpService, ERROR_ROUTES: ErrorRoutes): ErrorHandlingService {
    return new ErrorHandlingService($http, ERROR_ROUTES);
}

Core.AddComponent(ErrorHandlingComponentName, new ErrorHandlingComponent());