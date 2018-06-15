import { BaseModule } from "Core/Models/BaseModule";
import { IAuthenticationConstants } from "Core/Interfaces/IAuthenticationConstants";
import { IRouteBlog } from "Core/Interfaces/IRouteBlog";
import { RouteAuthorizationError } from "Core/Models/RouteAuthorizationError";
import { CoreService, ICoreService } from "Core/core.service";
import { AuthService } from "Core/auth.service";
import { IAuthInterceptor, AuthInterceptor } from "Core/auth.interceptor";
import { AuthorizationDirective } from "Core/auth.directive";
import { IHttpAuthRoutes } from "Core/Interfaces/IHttpAuthRoutes";
import { BlogState } from "Core/Models/BlogState";
import { TransitionService, TransitionHook, Transition, StateDeclaration } from "@uirouter/angularjs"
import { RegisteredHook, TransitionHookOptions, TransitionHookFn, HookResult, HookMatchCriteria } from "@uirouter/core/lib";
import * as angular from "Angular";
import uiRouter from 'angular-ui-router';

export class CoreModule extends BaseModule {

    constructor() {
        super();

        this.moduleName = "app.core";
        this.moduleDependencies = ["ngRoute", "ui.router"];

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
    StateTransitions($rootScope: ng.IRootScopeService, $transitions: TransitionService, $location: ng.ILocationService) {

        // authentication
        let authenticationHookCriteria: HookMatchCriteria = {
            to: "*"
        };
     
        let startTransitionAuthHookFn: TransitionHookFn = (transition: Transition): HookResult => {

            let toState: BlogState = <BlogState><any>transition.to();
            let fromState: BlogState = <BlogState><any>transition.from();

            console.log(`State change start from "${fromState.url}" to "${toState.url}"`);

            if (toState.component !== undefined && fromState.component !== undefined) {
                console.log(`From component "${fromState.component} to "${toState.component}"`)
            }

            if (toState.authorize === true) {
                toState.resolve = toState.resolve || {};

                if (!toState.resolve.authorizationResolver) {
                    toState.resolve.authorizationResolver = function (authService: AuthService) {
                        console.log("Resolving authorization.");

                        if (toState.action !== undefined && toState.resource !== undefined) {
                            return authService.IsAuthorizedPromise(toState.action, toState.resource, true);
                        } else {
                            throw new Error("State Authorization - Error: Destination state action or resource is undefined.");
                        }
                    };
                }
            } else {
                console.log("State Authorization: State does not need authorization.");
            }
        };

        $transitions.onStart(authenticationHookCriteria, startTransitionAuthHookFn);

        // authentication errors
        let stateTransitionErrorHookFn: TransitionHookFn = (transition: Transition): HookResult => {

            let fromState: BlogState = <any>transition.from();
            let toState: BlogState = <any>transition.to();
            let error: any = transition.error();

            console.log(`State change ERROR from "${fromState}" to "${toState}".`, error);
            if (error instanceof RouteAuthorizationError) {
                console.log("Redirecting to access denied page...");

                $location.path("/unauthorized");
            }
        };

        $transitions.onError(authenticationHookCriteria, stateTransitionErrorHookFn);

        // authentication sucess
        let stateTransitionSuccessHookFn: TransitionHookFn = (transition: Transition): HookResult => {

            let fromState: BlogState = <any>transition.from();
            let toState: BlogState = <any>transition.to();
            let error: any = transition.error();

            console.log(`State change success from "${fromState.url}" to "${toState.url}"`);
        };

        $transitions.onSuccess(authenticationHookCriteria, stateTransitionSuccessHookFn);
    }

    /**
     * Run service to handle route authorization.
     * Call from module declaration after loading route configs config(routeconfigs).run(RouteAuthorization)
     * @param $rootScope
     * @param $location
     */
    RouteAuthorization($rootScope: ng.IRootScopeService, $state: ng.ui.IStateService, $location: ng.ILocationService) {

        /**
         * Helper for logging errors
         * @param route
         */
        function getPath(route: any): string {
            if (!!route && typeof (route.originalPath) === "string") {
                return "'" + route.originalPath + "'";
            }
            return "[unknown route, using otherwise]";
        }

        $rootScope.$on("$routeChangeStart", function (event: ng.IAngularEvent, toRoute: IRouteBlog, fromRoute: IRouteBlog): void {

            if (true) {
                console.log("Route change start from", getPath(fromRoute), "to", getPath(toRoute));
            }

            if (toRoute.authorize === true) {
                toRoute.resolve = toRoute.resolve || {};
                if (!toRoute.resolve.authorizationResolver) {
                    toRoute.resolve.authorizationResolver = function (authService: AuthService) {
                        console.log("Resolving authorization.");

                        if (toRoute.action !== undefined && toRoute.resource !== undefined) {
                            return authService.IsAuthorizedPromise(toRoute.action, toRoute.resource, true);
                        } else {
                            throw new Error("Route Authorization - Error: Destination route action or resource is undefined.");
                        }
                    };
                }
            } else {
                console.log("Route Authorization: Route does not need authorization.");
            }
        });

        // handle all cases where a routing error has occured. In this instance
        $rootScope.$on("$routeChangeError", function (event: ng.IAngularEvent, to: IRouteBlog, from: IRouteBlog, error: RouteAuthorizationError): void {
            console.log("Route change ERROR from", getPath(from), "to", getPath(to), error);
            if (error instanceof RouteAuthorizationError) {
                console.log("Redirecting to access denied page...");

                $location.path("/unauthorized");
            }
        });

        // not needed in authorization / logging purposes only
        $rootScope.$on("$routeChangeSuccess", function (evt: ng.IAngularEvent, to: IRouteBlog, from: IRouteBlog): void {
            console.log("Route change success from", getPath(from), "to", getPath(to));
        });
    }

    /**
     * Authentication config
     * @param $httpProvider
     */
    private authInterceptorConfig($httpProvider: ng.IHttpProvider): void {
        $httpProvider.interceptors.push("authInterceptor");
    }

    /**
     * Configure core routing parameters
     * @param $routeProvider
     */
    private routeConfig($routeProvider: ng.route.IRouteProvider): void {

        try {
            $routeProvider
                .when("/forbidden", {
                    templateUrl: "core/forbidden.html",
                    caseInsensitiveMatch: true
                })
        } catch (err) {
            console.log(err.message);
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

export default Core; // default export for mocking the module

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
function authInterceptor($rootScope: ng.IRootScopeService, $q: ng.IQService, AUTHENTICATION_CONSTANTS: IAuthenticationConstants): IAuthInterceptor {
    "use strict";
    return new AuthInterceptor($rootScope, $q, AUTHENTICATION_CONSTANTS);
}