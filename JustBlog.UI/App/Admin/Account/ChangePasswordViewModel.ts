import {IChangePasswordViewModel} from "Admin/Account/IChangePasswordViewModel";

/**
 * Model for changing a password
 */
export class ChangePasswordViewModel implements IChangePasswordViewModel {
    OldPassword: string;
    NewPassword: string;
    ConfirmPassword: string;
}