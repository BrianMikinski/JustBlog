import { AdminService } from "admin/admin.service";
import { AuthService } from "Core/auth.service";
import { ComponentBase } from "Core/component.base";
import { BaseController } from "Core/Models/BaseController";
import { NotificationFactory } from "Notification/notification.factory";
import { IUser } from "./IUser";

export const MyAccountComponentName: string = "myAccount";

// define the bindings for my component
interface IMyAccountControllerBindings {
    account: IUser
}

// define the interface of the component controller
interface IMyAccountComponentController extends IMyAccountControllerBindings {

}

/**
 * Controller for MyComponent
 */
class MyAccountComponentController extends BaseController implements IMyAccountComponentController, ng.IController {

    account: IUser;
    private updatedAccount: IUser;

    inject = ["authService", "adminService", "notificationFactory", "$sce", "$state"]
    constructor(public authService: AuthService,
        public adminService: AdminService,
        public notificationFactory: NotificationFactory,
        public $sce: ng.ISCEService,
        public $state: ng.ui.IStateService) {
        super($sce);
    }

    /**
     * Update the currently logged in user
     */
    public updateAccount(): void {

        let onUpdateAccountComplete: (data: boolean) => void;

        onUpdateAccountComplete = (data: boolean) => {
            if (data === true) {
                this.notificationFactory.Success("Account details successfully updated.");
            } else {
                this.notificationFactory.Error("Account details could not be updated.");
            }
        };

        // make sure we don't update our email address nor user name
        this.updatedAccount.Email = "";
        this.updatedAccount.UserName = "";
        this.updatedAccount.LockoutEndDateUtc = new Date();

        this.adminService
            .updateAccount(this.updatedAccount)
            .then(onUpdateAccountComplete, this.OnErrorCallback);
    }

    /**
     * Calcuate a birthdate in the current format
     * @param date
     */
    private calculateBirthDate(date: string): Date {
        let currentBirthDay: Date | null = this.ParseJsonDate(date.toString());

        let day: number | undefined = currentBirthDay ? currentBirthDay.getDay() : undefined;
        let month: number | undefined = currentBirthDay ? currentBirthDay.getMonth() : undefined;
        let year: number | undefined = currentBirthDay ? currentBirthDay.getFullYear() : undefined;

        if (month && day && year) {
            currentBirthDay = new Date(month.toString() + "/" + day.toString() + "/" + year.toString());
            return new Date(currentBirthDay.toLocaleDateString());
        }
        else {
            return new Date();
        }
    }
}

/**
 * MyComponent Panel
 */
export class MyAccountComponent extends ComponentBase {

    constructor() {
        super();

        this.bindings = {
            account: "<"
        };

        this.controller = MyAccountComponentController;

        this.templateUrl = ["$element", "$attrs", ($element: ng.IAugmentedJQuery, $attrs: ng.IAttributes): string => {
            return require("admin/account/myAccount.html");
        }];
    }
}