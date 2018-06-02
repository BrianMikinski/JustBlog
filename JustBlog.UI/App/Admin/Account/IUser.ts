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
    Hometown: string;
    // GUID
    Id: string;
}