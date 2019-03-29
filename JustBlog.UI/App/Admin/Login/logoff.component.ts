import { AdminService } from "admin/admin.service";
import { AuthService } from "Core/auth.service";
import { ComponentBase } from "Core/component.base";
import { BaseController } from "Core/Models/BaseController";
import { NotificationFactory } from "Notification/notification.factory";
import { HomeComponentName } from "Blog/Home/home.component";

export const LogoffComponentName: string = "logoff";

/**
 * Controller for MyComponent
 */
class LogoffComponentController extends BaseController implements ng.IController {

    inject = ["authService", "adminService", "notificationFactory", "$sce", "$location"]
    constructor(public authService: AuthService,
                public adminService: AdminService,
                public notificationFactory: NotificationFactory,
                public $sce: ng.ISCEService,
                public $state: ng.ui.IStateService) {
        super($sce);
    }
    
    $onInit?(): void {

    }

    /**
     * Log a user out of the admin section of the application
     */
    public Logoff(): void {

        let onLogOffCallback: (response: boolean) => void = (response: boolean) => {

            let loginAttempt: boolean = response;

            if (loginAttempt) {

                this.notificationFactory.Success("Logoff was successful.");

                // reroute to the management screen now that we have logged in
                this.$state.go(HomeComponentName)

            } else {
                // notify that we did 
                this.notificationFactory.Error("Logoff was unsuccessful.");
            }
        };

        this.adminService.logOff().then(onLogOffCallback, this.OnErrorCallback);
    }
}

/**
 * MyComponent Panel
 */
export class LogoffComponent extends ComponentBase {

    constructor() {
        super();

        this.bindings = {}

        this.controller = LogoffComponentController;

        this.templateUrl = ["$element", "$attrs", ($element: ng.IAugmentedJQuery, $attrs: ng.IAttributes): string => {
            return require("admin/login/logoff.html");
        }];
    }
}