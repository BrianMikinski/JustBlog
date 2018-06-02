import { ApplicationUser } from "Admin/Account/ApplicationUser";
import { IdentityError } from "Admin/Register/IdentityError";

/**
 * Model for a registration attempt
 */
export class RegistrationAttempt {
    Succeeded: boolean;
    Errors: Array<IdentityError>;
    User: ApplicationUser;
}