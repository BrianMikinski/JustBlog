import {IChangePasswordViewModel} from "Admin/password/IChangePasswordViewModel";

/**
 * Model for changing a password
 */
export class ChangePasswordViewModel implements IChangePasswordViewModel {
    OldPassword: string;
    NewPassword: string;
    ConfirmPassword: string;
}