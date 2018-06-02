import {BaseModule} from "Core/Models/BaseModule";
import {NotificationFactory} from "Notification/notification.factory";

/**
 * Create a shell controller for our application
 */
export class NotificationModule extends BaseModule {

    constructor() {
        super();

        this.moduleName = 'app.notification';
        this.moduleDependencies = [];

        this.app = angular.module(this.moduleName, this.moduleDependencies);
    }
}

// set default export for adding to mocks
let Notification = new NotificationModule();
export default Notification;


function notificationFactory() {
    return new NotificationFactory();
}

Notification.AddFactory('notificationFactory', notificationFactory);