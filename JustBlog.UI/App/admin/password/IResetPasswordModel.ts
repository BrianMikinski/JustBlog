/**
 * Class for resetting a password
 */
export class IResetPasswordModel {
    email: string;
    password: string;
    confirmPassword: string;
    code: string;
}