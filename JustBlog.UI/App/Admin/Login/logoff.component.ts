import { AdminService } from "admin/admin.service";
import { AuthService } from "core/authorization/auth.service";
import { ComponentBase } from "core/component.base";
import { BaseController } from "core/models/BaseController";
import { NotificationFactory } from "notification/notification.factory";
import { HomeComponentName } from "blog/home/home.component";

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

        this.OnErrorCallback = (error: any):void => {
            this.notificationFactory.Error("Logoff was unsuccessful.");
        }
    }

    /**
     * Log a user out of the admin section of the application
     */
    public logoff(): void {

        let onLogOffCallback: () => void = () => {

            this.notificationFactory.Success("Logoff was successful.");

            // reroute to the management screen now that we have logged in
            this.$state.go(HomeComponentName)
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