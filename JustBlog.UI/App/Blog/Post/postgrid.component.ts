import { AuthService } from "Core/authorization/auth.service";
import { BaseController } from "Core/Models/BaseController";
import { BlogService } from "Blog/blog.service";
import { ComponentBase } from "Core/component.base";
import { CreatePostControllerBase } from "Blog/Post/CreatePostControllerBase";
import { GridQuery } from "Core/Models/GridQuery";
import { IBlogRouteParams } from "Blog/Interfaces/IBlogRouteParams";
import { NotificationFactory } from "Notification/notification.factory";
import { Post } from "Blog/Post/Post";
import { PostQueryFilter } from "Blog/Post/PostQueryFilter";

export const PostsGridComponentName: string = "postsgrid";

/**
 * Component for displaying posts
 */
class PostsGridComponentController extends CreatePostControllerBase implements ng.IController {

    private Posts: GridQuery<Post>;
  
    static inject = ["blogService", "$window", "$sce", "$stateParams", "notificationFactory", "authService"]
    constructor(private blogService: BlogService,
        private $window: ng.IWindowService,
        public $sce: ng.ISCEService,
        private $stateParams: ng.ui.IStateParamsService,
        private notificationFactory: NotificationFactory,
        private authService: AuthService) {
        super(blogService, $sce, notificationFactory);
    }

    $onInit?(): void {
        this.PostsPageAndSort(1, "PostedOn", false);
    }

    /**
     * Change the page of the posts
     * @param pageNumber
     */
    PostsPageAndSort(pageNumber: number, field: string, IsPublished: boolean): void {

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
     * Page and sort a data set
     * @param field
     */
    PostsSort(field: string, isPublished: boolean): void {

        if (field !== null) {

            this.Posts.PagingProperties.SortFields = this.RotateSortField(field, this.Posts.PagingProperties.SortFields);

            // Callback
            let onPostsReturned: (data: GridQuery<Post>) => void;
            onPostsReturned = (data: GridQuery<Post>) => {
                this.Posts = data;
            };

            let filter: PostQueryFilter = new PostQueryFilter();
            filter.IsPublished = isPublished;

            this.blogService.RetrievePostsGridData(this.Posts.PagingProperties, filter).then(onPostsReturned, this.OnErrorCallback);
        }
    }
}

export class PostsGridComponent extends ComponentBase {
    constructor() {
        super();

        this.bindings = {}
        this.controller = PostsGridComponentController;
        this.controllerAs = "$postsGridCtrl";

        this.templateUrl = ["$element", "$attrs", ($element: ng.IAugmentedJQuery, $attrs: ng.IAttributes): string => {
            return require("Blog/Post/postsGrid.html");
        }];
    }
}