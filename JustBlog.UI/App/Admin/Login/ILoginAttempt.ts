import {ApplicationUser} from "Admin/Account/Applicationuser";
import {SignInStatusEnum} from "Admin/Login/SignInStatusEnum";

export interface ILoginAttempt {
    Message: string;
    Status: SignInStatusEnum;
    User: ApplicationUser;
}