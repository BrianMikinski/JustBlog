import { IAuthEventConstants } from "admin/interfaces/IAuthEventConstants";
import { AuthService } from "Core/auth.service";
import * as angular from "angular";


interface IAuthorizationScope extends ng.IScope {
    [key: string]: any;

    // here you can add additional scope properties. You won"t need to
    // inject this because the link directive will handle it
    FieldProperties: any;
}

interface ILinkAttrs extends ng.IAttributes {
    action: string;
    resource: string;
    onlyShowUnauthorized: boolean;
}

/**
 * Authorization directive used to remove dom elements based on claims action/resource pairs or unrelated 
 * If onlyShowUnauthorized is on
 */
export class AuthorizationDirective {
    public scope: {
        onlyShowUnauthorized: "="
    };
    public restrict: string = "A";
    public replace: boolean = true;
    public link: (scope: IAuthorizationScope, element: ng.IAugmentedJQuery, attrs: ILinkAttrs) => void;

    private _compile: ng.ICompileService;
    private _scope: IAuthorizationScope;
    private _authService: AuthService;

    /**
     * Initilization and setup of auth directive
     * @param $compile
     * @param authService
     * @param AUTH_EVENT_CONSTANTS
     */
    constructor($compile: ng.ICompileService, authService: AuthService, AUTH_EVENT_CONSTANTS: IAuthEventConstants) {

        AuthorizationDirective.prototype.link = (scope: IAuthorizationScope, element: ng.IAugmentedJQuery, attrs: ILinkAttrs) => {

            // here you can add additional scope properties
            scope.FieldProperties = [];
            this._scope = scope;
            this._compile = $compile;
            this._authService = authService;

            // grab our actions, resources and elements
            let el: JQuery = angular.element(element);

            let isAuthorizedReturned: (response: boolean) => any;
            isAuthorizedReturned = (response: boolean) => {
                let isAuthorized: boolean = <boolean>response;

                let attrShowOnly: any = attrs.onlyShowUnauthorized;

                if (!isAuthorized || (attrs.onlyShowUnauthorized != undefined && attrShowOnly == "true" && !isAuthorized)) {
                    el.attr("ng-show", "false");
                } else {
                    el.attr("ng-show", "true");
                }

                // remove the attribute, otherwise it creates an infinite loop.
                el.removeAttr("is-authorized");
                $compile(el)(this._scope);

                return;
            };

            let onIsAuthorizedError: (error: string) => any;
            onIsAuthorizedError = (error: string) => {

                // remove the attribute, otherwise it creates an infinite loop.
                el.removeAttr("is-authorized");
                el.attr("ng-show", "False");
                $compile(el)(this._scope);

                return;
            };

            // Used at initialization
            if (attrs.onlyShowUnauthorized != null || attrs.onlyShowUnauthorized == false) {

                authService.IsAuthenticatedPromise().then((response: boolean) => {

                    // for show only unauthorized, we only want to show if they are not authenticated
                    if (response == true) {
                        isAuthorizedReturned(false);
                    } else {
                        isAuthorizedReturned(true);
                    }

                }, onIsAuthorizedError);
            } else {
                authService.IsAuthorizedPromise(attrs.action, attrs.resource, false).then(isAuthorizedReturned, onIsAuthorizedError);
            }

            // this should only recieve one argument or throw an error
            let authorizationEvent: (event: ng.IAngularEvent, args: boolean) => void = (event: ng.IAngularEvent, args: boolean) => {

                let attrShowOnly: any = attrs.onlyShowUnauthorized;

                if (event.name === AUTH_EVENT_CONSTANTS.loginSuccess ||
                    event.name === AUTH_EVENT_CONSTANTS.loginFailed ||
                    event.name === AUTH_EVENT_CONSTANTS.sessionTimeout) {

                    if (attrs.onlyShowUnauthorized != null && attrShowOnly === "true") {
                        if (args) {
                            args = false;
                        }
                    }
                } else if (event.name === AUTH_EVENT_CONSTANTS.logoutSuccess) {
                    if (attrs.onlyShowUnauthorized != null && attrShowOnly === "true") {
                        if (!args) {
                            args = true;
                        }
                    }
                }

                if (args == null || args == undefined) {
                    args = false;
                }


                isAuthorizedReturned(args);
            };

            this._scope.$root.$on(AUTH_EVENT_CONSTANTS.loginSuccess, authorizationEvent);
            this._scope.$root.$on(AUTH_EVENT_CONSTANTS.loginFailed, authorizationEvent);
            this._scope.$root.$on(AUTH_EVENT_CONSTANTS.logoutSuccess, authorizationEvent);
            this._scope.$root.$on(AUTH_EVENT_CONSTANTS.sessionTimeout, authorizationEvent);
        };
    }

    /**
     * Create a factory instance of the directive
     */
    public static Factory() {
        let directive: any = ($compile: ng.ICompileService, authService: AuthService, AUTH_EVENT_CONSTANTS: IAuthEventConstants) => {
            return new AuthorizationDirective($compile, authService, AUTH_EVENT_CONSTANTS);
        };

        // add security service injection here
        directive["$inject"] = ["$compile", "authService", "AUTH_EVENT_CONSTANTS"];

        return directive;
    }
}