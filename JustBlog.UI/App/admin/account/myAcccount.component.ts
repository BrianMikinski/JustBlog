import { AdminService } from "admin/admin.service";
import { AuthService } from "core/authorization/auth.service";
import { ComponentBase } from "core/component.base";
import { BaseController } from "core/models/BaseController";
import { NotificationFactory } from "notification/notification.factory";
import { User } from "./User";
import * as angular from "angular";

export const MyAccountComponentName: string = "myAccount";

// define the bindings for my component
interface IMyAccountControllerBindings {
    account: User
}

// define the interface of the component controller
interface IMyAccountComponentController extends IMyAccountControllerBindings {

}

/**
 * Controller for MyComponent
 */
class MyAccountComponentController extends BaseController implements IMyAccountComponentController, ng.IController {

    account: User;
    accountCopy: User;
    editEnabled: boolean = false;

    // dateTime Picker Options	
    datePickerPopup: any = {
        opened: false
    };

    datePickerOptions: ng.ui.bootstrap.IDatepickerConfig = {
        dateDisabled: this.dateDisabled,
        formatYear: "yy",
        maxDate: Date.now(),
        minDate: new Date(1900, 0, 0),
        startingDay: 1
    };

    testDate: Date = new Date(1900, 0, 0);

    birthDateFormat: string = "MM/dd/yyyy";
    altInputFormats: Array<string> = ["M!/d!/yyyy"];
    userBirthDate: Date;

    static $inject = ["authService", "adminService", "notificationFactory", "$sce", "$state"]
    constructor(public authService: AuthService,
        public adminService: AdminService,
        public notificationFactory: NotificationFactory,
        public $sce: ng.ISCEService,
        public $state: ng.ui.IStateService) {
        super($sce);
    }

    $onInit?() {

        this.datePickerOptions.maxDate = new Date(Date.now());
        
        this.accountBirthdayToObject();
        angular.copy(this.account, this.accountCopy);
    }

    /**
     * Calcuate a birthdate in the current format
     * @param date
     */
    calculateBirthDate(date: string): Date {
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

    /**	
     * Disable the date	
     * @param data	
     */
    dateDisabled(data: any): any {
        let date = data.date;
        let mode = data.mode;

        return mode === "day" && (date.getDay() === 0 || date.getDay() === 6);
    }

    /**
     * Confirm email address
     * */
    emailConfirmation(): void {
        this.adminService.initiateEmailConfirmation()
            .then(() => {
                this.notificationFactory.Success(`Please check your \"${this.account.Email}\" inbox to confirm your email address.`);
            }, this.OnErrorCallback);
    }

    openBirthdayDatePicker(): void {
        this.datePickerPopup.opened = true;
    }

    phoneConfirmation(): void {
        console.log("Phone confirmation clicked.");
    }

    /**
     * Fix the account birthday string that is passed back to the user
     * @param birthday
     */
    private accountBirthdayToObject() {
        this.account.Birthdate = new Date(this.account.Birthdate as unknown as string);
    }

    /**
     * Update the currently logged in user
     */
    updateAccount(): void {

        let onUpdateAccountComplete: (updatedUser: User) => void;

        onUpdateAccountComplete = (updatedUser: User) => {
            if (updatedUser !== undefined) {
                this.notificationFactory.Success("Account details successfully updated.");
                this.account = updatedUser;
                this.editEnabled = false;

                this.accountBirthdayToObject();
                angular.copy(this.account, this.accountCopy);
            } else {
                this.notificationFactory.Error("Account details could not be updated.");
            }
        };

        this.adminService
            .updateAccount(this.account)
            .then(onUpdateAccountComplete, this.OnErrorCallback);
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