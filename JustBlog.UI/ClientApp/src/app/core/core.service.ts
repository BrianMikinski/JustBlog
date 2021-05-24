import { Metadata } from "../blog/metadata/MetaData";
import { BaseService } from "./models/BaseService";

export const CoreServiceName: string = "coreService";

export class CoreService extends BaseService {

  metaData: Metadata = new Metadata();

  private blogEndPoint: string = "../blog";

  static $inject = ["$http", 'API_URL'];
  constructor(private $http: ng.IHttpService, API_URL: string) {
    super();

    this.blogEndPoint = `${API_URL}${this.blogEndPoint}`;

    this.GetMetaData();
  }

  GetMetaData(): ng.IPromise<Metadata> {

    let onHttpRequestReturned: (response: ng.IHttpResponse<Metadata>) => any;
    onHttpRequestReturned = (response: ng.IHttpResponse<Metadata>) => {

      this.metaData = <Metadata>response.data;
      return <Metadata>response.data;
    };

    return this.$http.get(`${this.blogEndPoint}/metadata`).then(onHttpRequestReturned, this.OnErrorCallback);
  }
}
