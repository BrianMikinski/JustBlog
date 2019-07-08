import { BaseService} from "Core/Models/BaseService";
import { MetaData } from "Blog/metadata/MetaData";

export class CoreService extends BaseService {

    metaData: MetaData = new MetaData();

    private blogEndPoint: string = "../blog";

    static $inject = ["$http"];
    constructor(private $http: ng.IHttpService) {
        super();

        this.GetMetaData();
    }

    GetMetaData(): ng.IPromise<MetaData> {

        let onHttpRequestReturned: (response: ng.IHttpPromiseCallbackArg<MetaData>) => any;
        onHttpRequestReturned = (response: ng.IHttpPromiseCallbackArg<MetaData>) => {

            this.metaData = <MetaData>response.data;
            return <MetaData>response.data;
        };

        return this.$http.get(`${this.blogEndPoint}/metadata`).then(onHttpRequestReturned, this.OnErrorCallback);
    }
}