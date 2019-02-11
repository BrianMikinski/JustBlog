// interface used to update logins
export interface LoginUpdate {
    OldEmail: string;
    NewEmail: string;
    ConfirmNewEmail: string;
}