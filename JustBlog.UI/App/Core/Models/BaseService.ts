/**
 * Base class for handling services
 */
export abstract class BaseService {

    // error handling callbacks
    private errorMessage: string = "An error has been encountered in this controller.";

    OnErrorCallback: (Error: any) => void;

    BearerHeader: string = "bearer";

    constructor() {
        let onErrorCallBack: (data:any) => void = (data: any) => {
            console.log(this.errorMessage);
        };

        this.OnErrorCallback = onErrorCallBack;
    }

    /**
     * Set the base errorMessage that is displayed when a service encounters an error
     * @param message
     */
    SetErrorMessage(message: string): void {
        this.errorMessage = message;
    }

    /**
     * Create an anti-forgery token parameter
     * @param antiForgeryToken
     */
    ConfigAntiForgery(antiForgeryToken: string): ng.IRequestShortcutConfig {
        let config: angular.IRequestShortcutConfig = {
            headers: {
                "RequestVerificationToken": antiForgeryToken
            }
        };

        return config;
    }

    /**
     * create a query string based on json paramaters
     * @param json
     */
    CreateWebAPIParams(json: any): string {

        var queryString: string = "?";
        for (var key in json) {
            queryString += key + "=" + json[key] + "&";
        }
        return queryString.substring(0, queryString.length - 1);
    }

    /**
     * Serialize a complex javascript object to query string parameters
     * @param obj
     * @param prefix
     */
    SerializeToQueryStringParams(obj: any, prefix: string | null):string {
        let str:Array<any> = [];
        for (var p in obj) {
            if (obj.hasOwnProperty(p)) {
                let k:string = prefix ? prefix + "[" + p + "]" : p;
                let v:any = obj[p];
                str.push(typeof v === "object" ?
                    this.SerializeToQueryStringParams(v, k) :
                    encodeURIComponent(k) + "=" + encodeURIComponent(v));
            }
        }

        return str.join("&");
    }

    /**
     * Configure a header for anti forgery
     */
    ConfigAppJson: ng.IRequestShortcutConfig = {
        headers: {
            "content-type": "application/json"
        }
    };

    /**
     * Create headers with content-type json and request verification token
     * @param antiForgeryToken
     */
    ConfigSecureAppJson(antiForgeryToken: string, bearerToken: string): ng.IRequestShortcutConfig  {


        return {
            headers: {
                "content-type": "application/json",
                "RequestVerificationToken": antiForgeryToken,
                "Authorization": `Bearer ${bearerToken}`
            }  
        };
    }
}
