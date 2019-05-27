/**
 * custom error type
 */
export class RouteAuthorizationError{

    constructor(private isAccessDenied: boolean, private message: string, private description: string) {

    }

    Error(): string {

        let errorMessage: string = this.message + ": " + this.description;

        if (this.isAccessDenied) {
            return "Access Denied " + errorMessage;
        } else {
            return "Error " + errorMessage;
        }
    }
}