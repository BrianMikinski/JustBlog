import { BaseService } from "Core/Models/BaseService";
import * as angular from "angular";
import { ErrorRoutes } from "./ErrorRoutes";

angular
    .module("core")
    .service("errorHandlingService",
        ["$http", "ERROR_ROUTES", ($http: ng.IHttpService, ERROR_ROUTES: ErrorRoutes) => new ErrorHandlingService($http, ERROR_ROUTES)])

/**
 * Calss for handling error creation
 * */
export class ErrorHandlingService extends BaseService {

    static $inject = ["$http", "ERROR_ROUTES"];
    constructor(private $http: ng.IHttpService, private ERROR_ROUTES: ErrorRoutes) {
        super();

    }

    /**
     * 400 - Bad RequestError
     * */
    badRequestErrorTest() {
        this.$http.get(this.ERROR_ROUTES.BadRequest400);
    }

    /**
     * 401 - Unauthorized Error
     * */
    unauthorizedErrorTest() {
        this.$http.get(this.ERROR_ROUTES.Unauthorized401);
    }

    /**
     * 404 - Not Found Error
     * */
    notfoundErrorTest() {
        this.$http.get(this.ERROR_ROUTES.NotFound404);
    }

    /**
     * 500 - Internal Server Error
     * */
    internalServerErrorTest() {
        this.$http.get(this.ERROR_ROUTES.InternalServerError500);
    }

}