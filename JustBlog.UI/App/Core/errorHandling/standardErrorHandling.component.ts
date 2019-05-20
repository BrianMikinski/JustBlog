﻿import { ComponentBase } from "Core/component.base";
import { BaseController } from "Core/Models/BaseController";
import { ErrorHandlingService } from "./errorHandling.service";

export const ErrorHandlingComponentName: string = "errorHandling";

/**
 * Component designed to handle http error presentation
 */
export class ErrorHandlingComponent extends ComponentBase {

    constructor() {
        super();

        this.bindings = {
            error: "<"
        };

        this.controller = ErrorHandlingController;

        this.templateUrl = ["$element", "$attrs", ($element: ng.IAugmentedJQuery, $attrs: ng.IAttributes): string => {
            return require("Core/errorHandling/httpError.html");
        }];
    }
}

// define the bindings for my component
interface IErrorHandlingControllerBindings {
    error: number
}

// define the interface of the component controller
interface IErrorHandlingComponentController extends IErrorHandlingControllerBindings {

}

/**
 * Error handling
 */
class ErrorHandlingController extends BaseController implements IErrorHandlingComponentController, ng.IController {

    error: number;

    inject = ["$sce", "errorHandlingService"]
    constructor($sce: ng.ISCEService, private errorHandlingService: ErrorHandlingService) {
        super($sce);
    }

    badRequest() {
        this.errorHandlingService.badRequestErrorTest();
    }

    unauthorized() {
        this.errorHandlingService.unauthorizedErrorTest();
    }

    notFound() {
        this.errorHandlingService.notfoundErrorTest();
    }

    internalServierError() {
        this.errorHandlingService.internalServerErrorTest();
    }
}