import { BaseService} from "core/models/BaseService";
import { Metadata } from "blog/metadata/MetaData";

export const CoreServiceName: string = "coreService";

export class CoreService extends BaseService {

    metaData: Metadata = new Metadata();

    private blogEndPoint: string = "../blog";

    static $inject = ["$http"];
    constructor(private $http: ng.IHttpService) {
        super();

        this.GetMetaData();
    }

    GetMetaData(): ng.IPromise<Metadata> {

        let onHttpRequestReturned: (response: ng.IHttpPromiseCallbackArg<Metadata>) => any;
        onHttpRequestReturned = (response: ng.IHttpPromiseCallbackArg<Metadata>) => {

            this.metaData = <Metadata>response.data;
            return <Metadata>response.data;
        };

        return this.$http.get(`${this.blogEndPoint}/metadata`).then(onHttpRequestReturned, this.OnErrorCallback);
    }
}