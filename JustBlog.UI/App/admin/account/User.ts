export interface User {
    Birthdate: string | Date;
    FirstName: string;
    LastName: string;
    Email: string;
    EmailConfirmed: boolean;
    PhoneNumber: string;
    PhoneNumberConfirmed: boolean;
    TwoFactorEnabled: boolean;
    UserName: string;
    AddressLine1: string;
    AddressLine2: string;
    City: string;
    State: string;
    PostalCode: string;
    Country: string;
    // GUID
    Id: string;
}