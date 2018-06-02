/**
 * Model used for registering a new user
 */
export class RegistrationUser {
    BirthDate: any;
    FirstName: string;
    LastName: string;
    Email: string;
    EmailConfirmed: boolean;
    PhoneNumber: string;
    PhoneNumberConfirmed: boolean;
    TwoFactorEnabled: boolean;
    UseName: string;
    HomeTown: string;
    ID: string;

    // fields for a new user
    Password: string;
    ConfirmPassword: string;
}