import {ApplicationUser} from "admin/account/Applicationuser";
import {SignInStatusEnum} from "admin/login/SignInStatusEnum";

export interface ILoginAttempt {
    Message: string;
    Status: SignInStatusEnum;
    User: ApplicationUser;
}