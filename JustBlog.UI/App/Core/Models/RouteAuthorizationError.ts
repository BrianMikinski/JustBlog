import {IRouteAuthorizationError} from "Core/Interfaces/IRouteAuthorizationError";

/**
 * custom error type
 */
export class RouteAuthorizationError implements IRouteAuthorizationError {

    constructor(private isAccessDenied: boolean, private message: string, private description: string) { }

    Error(): string {

        let errorMessage: string = this.message + ": " + this.description;

        if (this.isAccessDenied) {
            return "Access Denied " + errorMessage;
        } else {
            return "Error " + errorMessage;
        }
    }
}