/**
 * Interface for encapsulating errors from the server
 */ 
export class IdentityError {
    Code: string;
    Description: string;

    toString() {
        return `Error Code : "${this.Code}" - ${this.Description}`
    }
}