import { ComponentBase } from "../component.base";
import { BaseController } from "../models/BaseController";
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
      return require("!raw-loader!./httpError.html");
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

  error: number | undefined;
  tempError: number | undefined;
  private onRequestCallback: () => void;


  static $inject = ["$sce", "errorHandlingService"]
  constructor($sce: ng.ISCEService, private errorHandlingService: ErrorHandlingService) {
    super($sce);

    this.OnErrorCallback = (data: any) => {
      this.error = this.tempError;
      console.log(`Http Error: ${this.error}`)
      this.tempError = undefined;
    };

    let onRequestCallback: (response: any) => void = (response: any) => {
      console.log("Request succeeded?")
    }
  }

  /**
   * 400
   * */
  badRequest() {
    this.error = undefined;
    this.tempError = 400;
    this.errorHandlingService.badRequestErrorTest()
      .then(this.onRequestCallback, this.OnErrorCallback);
  }

  /**
   * 401
   * */
  unauthorized() {
    this.error = undefined;
    this.tempError = 401;
    this.errorHandlingService.unauthorizedErrorTest()
      .then(this.onRequestCallback, this.OnErrorCallback);
  }

  /**
   * 404
   * */
  notFound() {
    this.error = undefined;
    this.tempError = 404;
    this.errorHandlingService.notfoundErrorTest()
      .then(this.onRequestCallback, this.OnErrorCallback);
  }

  /**
   * 500
   * */
  internalServerError() {
    this.error = undefined;
    this.tempError = 500;
    this.errorHandlingService.internalServerErrorTest()
      .then(this.onRequestCallback, this.OnErrorCallback);
  }
}
