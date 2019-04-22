export interface IUser {
    BirthDate: Date;
    FirstName: string;
    LastName: string;
    Email: string;
    EmailConfirmed: boolean;
    AccessFailedCount: number;
    LockoutEnabled: boolean;
    LockoutEndDateUtc: Date;
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