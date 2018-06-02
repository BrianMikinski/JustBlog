console.log("entered auth interceptor");
import { IAuthenticationConstants } from "Core/Interfaces/IAuthenticationConstants";
import { RouteAuthorizationError } from "Core/Models/RouteAuthorizationError";

export interface IAuthInterceptor {
    Request(config: any): any;
    ResponseError(response: any): any;
}

/**
 * Class for intercepting routing requests. Primarily used for authentication
 */
export class AuthInterceptor implements IAuthInterceptor {

    private LOCAL_TOKEN_KEY: string = "JustBlogToken";

    static $inject = ["$rootScope", "$q", "AUTHENTICATION_CONSTANTS"];
    constructor(private $rootScope: ng.IRootScopeService,
        private $q: ng.IQService,
        private AUTHENTICATION_CONSTANTS: IAuthenticationConstants) { }

    /**
     * Handle a new request
     * @param config
     */
    Request(config: any): any {

        let token:string | null = window.localStorage.getItem(this.LOCAL_TOKEN_KEY);

        if (token) {
            config.headers["X-Auth-Token"] = token;
        }

        return config;
    };

    /**
     * Handle a response error
     * @param response
     */
    ResponseError(response: any): any {

    if (response.status === 400) {
        this.$rootScope.$broadcast("unauthorized");
    }

    if (response.status === 403) {
        this.$rootScope.$broadcast("forbidden");
    }

    return this.$q.reject(response);
}

}