import { BaseController } from "Core/Models/BaseController";
import { ComponentBase } from "Core/component.base";
import { GridQuery } from "Core/grid/GridQuery";
import { CoreService } from "Core/core.service";
import { Post } from "Blog/post/Post";
import { PostQueryFilter } from "Blog/post/PostQueryFilter";
import { BlogService } from "Blog/blog.service";
import { MetaData } from "Blog/metadata/MetaData";

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
    private MetaData: MetaData;

    inject = ["coreService", "blogService", "$sce"]
    constructor(private coreService: CoreService, private blogService: BlogService, public $sce: ng.ISCEService) {
        super($sce);

        this.RetrieveMetaData();
        this.PostsPageAndSort(1, "PostedOn", true);
    }

    /**
     * Get the most up-to-date meta data
     */
    private RetrieveMetaData(): void {

        let metaDataCallBack: (data: MetaData) => void;
        metaDataCallBack = (data: MetaData) => {
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
            return require("Blog/home/home.html");
        }];
    }
}