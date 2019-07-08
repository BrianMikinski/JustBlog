import { BaseService } from "core/models/BaseService";
import { IErrorRoutes } from "./IErrorRoutes";

/**
 * Calss for handling error creation
 * */
export class ErrorHandlingService extends BaseService {

    private onRequestCallback: (response: ng.IHttpResponse<any>) => void;

    static $inject = ["$http", "ERROR_ROUTES"];
    constructor(private $http: ng.IHttpService, private ERROR_ROUTES: IErrorRoutes) {
        super();

        this.onRequestCallback = (response: ng.IHttpResponse<any>) => {
            console.log("Request succeeded???")
        }
    }

    /**
     * 400 - Bad RequestError
     * */
    badRequestErrorTest(): ng.IPromise<void> {
        return this.$http.get(this.ERROR_ROUTES.BadRequest400)
            .then(this.onRequestCallback);
    }

    /**
     * 401 - Unauthorized Error
     * */
    unauthorizedErrorTest(): ng.IPromise<void> {
        return this.$http.get(this.ERROR_ROUTES.Unauthorized401)
            .then(this.onRequestCallback, );
    }

    /**
     * 404 - Not Found Error
     * */
    notfoundErrorTest(): ng.IPromise<void> {
        return this.$http.get(this.ERROR_ROUTES.NotFound404)
                .then(this.onRequestCallback);
    }

    /**
     * 500 - Internal Server Error
     * */
    internalServerErrorTest(): ng.IPromise<void> {
        return this.$http.get(this.ERROR_ROUTES.InternalServerError500)
            .then(this.onRequestCallback);
    }

}