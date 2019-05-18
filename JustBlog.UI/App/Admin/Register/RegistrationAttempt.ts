import { ApplicationUser } from "admin/account/ApplicationUser";
import { IdentityError } from "admin/register/IdentityError";

/**
 * Model for a registration attempt
 */
export class RegistrationAttempt {
    Succeeded: boolean;
    Errors: Array<IdentityError>;
    User: ApplicationUser;
}