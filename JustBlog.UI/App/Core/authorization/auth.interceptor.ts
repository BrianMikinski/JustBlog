console.log("entered auth interceptor");
import { IHttpResponse, IPromise, IRequestConfig } from "angular";
import { IAuthenticationConstants } from "core/authorization/IAuthenticationConstants";
import { StateService} from "@uirouter/angularjs";

/**
 * Class for intercepting routing requests. Primarily used for authentication
 */
export class AuthInterceptor implements ng.IHttpInterceptor {

    static $inject = ["$q", "$state", "AUTHENTICATION_CONSTANTS"];
    constructor(private $q: ng.IQService,
        private $state: StateService,
        private AUTHENTICATION_CONSTANTS: IAuthenticationConstants) {

        this.request = this.requestFunction;
        this.responseError = this.responseErrorFunction;

        console.log("Intercepted Constructor called");
    }

    /**
     * Add authentication to a bearer token if it exists
     * @param config
     */
    request?(config: IRequestConfig): IRequestConfig | IPromise<IRequestConfig>;

    private requestFunction = (config: IRequestConfig): IRequestConfig | IPromise<IRequestConfig> => {

        let bearerToken: string = window.localStorage.getItem(this.AUTHENTICATION_CONSTANTS.AuthToken);

        if (bearerToken !== "") {
            config.headers["Authorization"] = `Bearer ${bearerToken}`;
        }

        return config;
    }

    /**
     * Handle a response error
     * @param response
     */
    responseError?<T>(rejection: any): IPromise<IHttpResponse<T>> | IHttpResponse<T>;
    
    private responseErrorFunction: any = <T>(rejection: any): IPromise<IHttpResponse<T>> | IHttpResponse<T> => {

        if (rejection.status === 400) {
            
            this.$state.go("errorHandling", {
                error: 400
            });

        }

        if (rejection.status === 403) {
            
            this.$state.go("errorHandling", {
                error: 403
            });

        }

        if (rejection.status === 500) {
            
            this.$state.go("errorHandling", {
                error: 500
            });
        }

        return this.$q.reject(rejection);
    }

}