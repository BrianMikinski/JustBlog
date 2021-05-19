import { AuthenticationConstants } from "core/authorization/AuthenticationConstants";
import { BaseService } from "core/models/BaseService";
import { Claim } from "core/authorization/Claim";
import { JwtPayload } from "core/authorization/JWTPayload";
import { RouteAuthorizationError } from "core/authorization/RouteAuthorizationError";

export const AuthServiceName: string = "authService";

/**
 * Class for authorizing and authenticating the current logged in user.
 */
export class AuthService extends BaseService {

    private httpHeaderMethodDefaultsError: string = "Authorization Service - Error: $http: ng.IHttpService default headers are not available.";

    private jwtDataKey: string = "AppData";

    static $inject = ["$http", "$q", "AUTHENTICATION_CONSTANTS"];
    constructor(private $http: ng.IHttpService,
        private $q: ng.IQService,
        private AUTHENTICATION_CONSTANTS: AuthenticationConstants) {
        super();
    }

    /**
     * Set a user authentication token
     * @param token
     */
    SetUserToken(token: string): void {
        window.localStorage.setItem(this.AUTHENTICATION_CONSTANTS.AuthToken, token);

        if (this.$http.defaults.headers !== undefined) {
            this.$http.defaults.headers.common[this.BearerHeader] = token;
        } else {
            throw Error(`${this.httpHeaderMethodDefaultsError}`);
        }
    }

    /**
     * Retrieve the user login from local storage
     */
    GetUserLogin(): string {
        let payload: JwtPayload | null = this.getBearerPayload();

        if (payload !== null && (this.jwtDataKey in payload.Claims) && payload.IsValid()) {

            return payload.Claims.filter(function (claim: Claim) {
                return claim.Action === "data";
            })[0].Resource;
        } else {
            return "";
        }
    }

    /**
     * Remove a user authentication token
     */
    DestroyUserTokens(): void {
        window.localStorage.removeItem(this.AUTHENTICATION_CONSTANTS.AuthToken);
        window.localStorage.removeItem(this.AUTHENTICATION_CONSTANTS.UserName);

        if (this.$http.defaults.headers !== undefined) {
            this.$http.defaults.headers.common[this.BearerHeader] = undefined;
        } else {
            throw Error(`${this.httpHeaderMethodDefaultsError}`);
        }
    }

    /**
     * Check if a user has a valid unexpired jwt token.
     */
    IsAuthenticatedPromise(): ng.IPromise<void | boolean> {

        let jwtToken: JwtPayload | null = this.getBearerPayload();

        let isAuthenticated: boolean = false;

        if (jwtToken !== null) {
            isAuthenticated = jwtToken.IsValid();
        }

        let deferred: ng.IDeferred<boolean> = this.$q.defer();
        deferred.resolve(isAuthenticated);

        return deferred.promise;
    }

    /**
     * Retrieve the locally stored bearer token
     */
    GetLocalToken(): string {

        let token: string | null = window.localStorage.getItem(this.AUTHENTICATION_CONSTANTS.AuthToken);

        if (token !== null && token !== "undefined") {
            return token;
        }

        return ""
    }

    /**
     * Get users claims
     */
    GetUserClaims(): Array<Claim> {

        let payload: JwtPayload | null = this.getBearerPayload();

        if (payload !== null && payload.IsValid()) {
            return payload.Claims;
        } else {
            return [];
        }
    }

    /**
     * Check if a user is authorized for a specific action. First check if they are available locally. If they are,
     * then we grab them. If not we broadcast up the scope (They should be stored in the Shell controller)
     * Next, if we can't find them then we go to the server to get them.
     * @param action
     * @param resource
     */
    IsAuthorizedPromise(action: string, resource: string, isRouteAuthorization: boolean): ng.IPromise<boolean> {

        // if we already have the user claims, create a promise and return it's value
        if (this.GetLocalToken() !== undefined) {

            let payload: JwtPayload | null = this.getBearerPayload();

            // check that token is still valid for current time frame
            if (payload !== null && payload.IsValid()) {
                return this.isAuthorizedPromise(payload.Claims, action, resource, isRouteAuthorization);
            }
            else {
                let deferred: ng.IDeferred<boolean> = this.$q.defer();
                deferred.resolve(false);
                deferred.reject("User has not been authenticated.")

                return deferred.promise;
            }
        } else {
            throw new Error("Auth Service: Local JWT could not be found. Please insure the user has been authenticated.");
        }
    }

    /**
     * Create a promise to check if the current user has acceptable claims or not.
     * @param userClaims
     * @param action
     * @param resource
     */
    private isAuthorizedPromise(userClaims: Array<Claim>, action: string, resource: string, isRouteAuthorization: boolean): ng.IPromise<boolean> {

        let deferred: ng.IDeferred<boolean> = this.$q.defer();
        deferred.resolve(this.checkValidClaim(userClaims, action, resource, isRouteAuthorization));

        return deferred.promise;
    }

    /**
     * Check if we have valid claims or not
     * @param claims
     * @param action
     * @param resource
     */
    private checkValidClaim(claims: Array<Claim>, action: string, resource: string, isRouteAuthorization: boolean): boolean {

        for (let i in claims) {
            let currentClaim: Claim = claims[i];

            if ( action != null &&
                currentClaim.Action != null &&
                currentClaim.Action.toLowerCase() === action.toLowerCase() &&
                currentClaim.Resource != null &&
                resource != null &&
                currentClaim.Resource.toLowerCase() === resource.toLowerCase()) {

                return true;
            }
        }

        if (isRouteAuthorization) {
            throw new RouteAuthorizationError(true, "Route Authorization Error",
                "You do not have access to view a page with aciton \"" + action + " on " + "\"" + resource + "\"");
        } else {
            return false;
        }
    }

    /**
     * Retrieve token payload from locally stored jwt token. - Bush league and needs reworked
     */
    private getBearerPayload(): JwtPayload | null {

        let localToken: string | null = this.GetLocalToken();

        if (localToken !== undefined && localToken !== "") {

            // jwt tokens have three parts - header, payload and verification signature
            let payload:any = JSON.parse(atob(localToken.split(".")[1]));

            let jwtAdminClaim: string = payload.auth_claim;
            let jwtAppData: string = payload.data_claim;
            let claims: Array<Claim> = new Array<Claim>();

            // retrieve admin claim
            let adminClaim: Claim = new Claim();
            adminClaim.Action = jwtAdminClaim.split("|")[0];
            adminClaim.Resource = jwtAdminClaim.split("|")[1];
            claims.push(adminClaim);

            // retrieve data claim
            let dataClaim: Claim = new Claim();
            dataClaim.Action = jwtAppData.split("|")[0];
            dataClaim.Resource = jwtAppData.split("|")[1];
            claims.push(dataClaim);

            let jwtPayload: JwtPayload = new JwtPayload();
            jwtPayload.Audience = <string>payload.aud;
            jwtPayload.Expiration = <number>payload.exp;
            jwtPayload.Issuer = <string>payload.iss;
            jwtPayload.NotBefore = <number>payload.nbf;
            jwtPayload.Claims = claims;

            return jwtPayload;
        } else {
            return null;
        }
    }
}