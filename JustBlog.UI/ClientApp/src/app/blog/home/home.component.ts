import { ComponentBase } from "../../core/component.base";
import { CoreService } from "../../core/core.service";
import { GridQuery } from "../../core/grid/GridQuery";
import { BaseController } from "../../core/models/BaseController";
import { BlogService } from "../blog.service";
import { Metadata } from "../metadata/MetaData";
import { Post } from "../post/Post";
import { PostQueryFilter } from "../post/PostQueryFilter";


export const HomeComponentName: string = "home";

// define the bindings for my component
interface IHomeControllerBindings { }

// define the interface of the component controller
interface IHomeComponentController extends IHomeControllerBindings { }

/**
 * Controller for MyComponent
 */
export class HomeComponentController extends BaseController implements IHomeComponentController, ng.IController {

    private Posts: GridQuery<Post>;
    private MetaData: Metadata;

    static $inject = ["coreService", "blogService", "$sce"]
    constructor(private coreService: CoreService, private blogService: BlogService, public $sce: ng.ISCEService) {
        super($sce);

        this.RetrieveMetaData();
        this.PostsPageAndSort(1, "PostedOn", true);
    }

    /**
     * Get the most up-to-date meta data
     */
    private RetrieveMetaData(): void {

        let metaDataCallBack: (data: Metadata) => void;
        metaDataCallBack = (data: Metadata) => {
            this.MetaData = data;
        };

        this.coreService.GetMetaData().then(metaDataCallBack, this.OnErrorCallback);
    }

    /**
     * Change the page of the posts
     * @param pageNumber
     */
    private PostsPageAndSort(pageNumber: number, field: string, IsPublished: boolean): void {

        if (pageNumber !== null || field !== null) {

            if (this.Posts === undefined) {
                this.Posts = new GridQuery<Post>();
            }

            if (pageNumber !== null) {
                this.Posts.PagingProperties.Index = pageNumber - 1;
            }

            if (field !== null) {
                this.Posts.PagingProperties.SortFields = this.ClearOrReplaceField(field, this.Posts.PagingProperties.SortFields);
            }

            let onPostsReturned: (data: GridQuery<Post>) => void;
            onPostsReturned = (data: GridQuery<Post>) => {
                this.Posts = data;
            };

            let filter: PostQueryFilter = new PostQueryFilter();
            filter.IsPublished = IsPublished;

            this.blogService.RetrievePostsGridData(this.Posts.PagingProperties, filter).then(onPostsReturned, this.OnErrorCallback);

        } else {
            throw new Error("Page number or field was not specified");
        }
    }

    /**
     * Function called when controller is initialized
     */
    $onInit(): void {

    }

    /**
     * Function called when an object in the controller changes.
     * Note: This will not be called when a new item is added to an
     * array. It is also only called for one-way bindings (<) and @ bindings
     * @param changesObj
     */
    $onChanges(changesObj: any): void {

    }
}

/**
 * MyComponent Panel
 */
export class HomeComponent extends ComponentBase { //implements ng.IComponentOptions {

    constructor(/* inject services used by component here*/) {
        super();

        this.bindings = {}

        this.controller = HomeComponentController;
        this.controllerAs = "homeCtrl"

        this.templateUrl = ["$element", "$attrs", ($element: ng.IAugmentedJQuery, $attrs: ng.IAttributes): string => {
            return require("blog/home/home.html");
        }];
    }
}
