/**
 * Class for resetting a password
 */
export class IResetPasswordModel {
    Email: string;
    Password: string;
    ConfirmPassword: string;
    Code: string;
}