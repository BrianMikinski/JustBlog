import {IChangePasswordViewModel} from "admin/password/IChangePasswordViewModel";

/**
 * Model for changing a password
 */
export class ChangePasswordViewModel implements IChangePasswordViewModel {
    OldPassword: string;
    NewPassword: string;
    ConfirmPassword: string;
}