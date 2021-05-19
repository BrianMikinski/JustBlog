import { ApplicationUser } from "../account/ApplicationUser";
import { IdentityError } from "./IdentityError";

/**
 * Model for a registration attempt
 */
export class RegistrationAttempt {
    Succeeded: boolean;
    Errors: Array<IdentityError>;
    User: ApplicationUser;
}
