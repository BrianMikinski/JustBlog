import { BaseModule } from "Core/Models/BaseModule";
import { NotificationFactory } from "notification/notification.factory";
import * as angular from "angular";

const moduleName: string = 'app.notification';
export default moduleName;

/**
 * Create a shell controller for our application
 */
export class NotificationModule extends BaseModule {

    constructor() {
        super();

        this.moduleName = moduleName;
        this.moduleDependencies = [];

        this.app = angular.module(this.moduleName, this.moduleDependencies);
    }
}

// set default export for adding to mocks
let Notification = new NotificationModule();


function notificationFactory() {
    return new NotificationFactory();
}

Notification.AddFactory('notificationFactory', notificationFactory);