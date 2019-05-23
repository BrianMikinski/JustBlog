import { BlogService } from "Blog/blog.service";
import { Category } from "Blog/Category/Category";
import { IBlogRouteParams } from "Blog/Interfaces/IBlogRouteParams";
import { MetaData } from "Blog/MetaData/MetaData";
import { Post } from "Blog/Post/Post";
import { ITagPosts } from "Blog/Tag/ITagPosts";
import { Tag } from "Blog/Tag/Tag";
import { AuthService } from "Core/authorization/auth.service";
import { CoreService } from "Core/core.service";
import { BaseController } from "Core/Models/BaseController";
import { NotificationFactory } from "Notification/notification.factory";

/**
 * Controller for reading and writing blog posts
 */
export class BlogController extends BaseController {

    CurrentTag: ITagPosts;
    Category: Category;
    MetaData: MetaData;
    Tag: Tag;

    static $inject = ["coreService", "blogService", "$route", "$routeParams", "$location", "$sce", "$window",
        "notificationFactory", "authService"];
    constructor(private coreService: CoreService,
        private _blogService: BlogService,
        private $route: ng.route.IRouteService,
        private $routeParams: IBlogRouteParams,
        private _location: ng.ILocationService,
        public $sce: ng.ISCEService,
        private $window: ng.IWindowService,
        private _notificationService: NotificationFactory,
        private _authService: AuthService) {
        super($sce);

        // Initialize controller
        this.initCategories();
        this.initTags();
        this.initRouteParams();
    }

    /**
     * Parse a json object to a date time object
     * @param date
     */
    ParseJsonDate(date: any): Date {
        if (date) {
            let dateRegex = /-?\d+/;
            let extractedDate: RegExpExecArray | null = dateRegex.exec(date);
            if (extractedDate) {
                return new Date(parseInt(extractedDate[0]));
            }
        }

        return new Date();
    }

    /**
     * Parse a datetime object to a json string
     * @param date
     */
    ParseDateTime(date: any): Date {
        if (date) {
            let parsedDate:Date = new Date(date);
            return parsedDate;
        } else {
            return new Date();
        }
    }

    /**
     * Search for a post with a specific id
     * @param postId
     */
    RetrievePost(postId: number): void {

       
        this._blogService.RetrievePost(postId).then(function (data:Post) {
            console.log("Post returned");
        }, this.OnErrorCallback);
    }

    /**
     * Retrieve a list of posts by a category Id
     * @param categoryId
     */
    RetrievePostsByCategory(categoryId: number): void {

        //this._blogService
    }

    /**
     * Retrieve a category based on a url slug
     * @param urlSlug
     */
    RetrieveCategoryUrlSlug(urlSlug: string): void {

        let onMetaDataReturned: (category: Category) => void = (category: Category): void => {

            throw new Error("Not Implemented: Retrieve Category Url Slug:");
        };

        throw new Error("Not Implemented");
        //this._blogService.RetrievePostUrlSlug(urlSlug).then(this.onPostReturned, this.OnErrorCallback);
    }

    /**
     * Retrieve a tag based on a url slug
     * @param urlSlug
     */
    RetrieveTagUrlSlug(urlSlug: string): void {
        let onTagPostReturned: (data: ITagPosts) => void = (data: ITagPosts): void => {
            throw Error("tag post callback not implemented");
        };

        this._blogService.RetrieveTagUrlSlug(urlSlug).then(onTagPostReturned, this.OnErrorCallback);
    }

    /**
     * Search for new posts
     * @param searchTerm
     */
    SearchPosts(searchTerm: string): void {

        throw new Error("Not implemented");
    }

    /**
     * Save a category
     * @param category
     */
    SaveCategory(category: Category): void {
        let onCategorySavedReturned: (data: Category) => void;
        onCategorySavedReturned = (data: Category) => {
            this.Category = data;
            this._notificationService.Success(`Post "${category.Name}" was succesfully saved.`);
        };

        this._blogService.SaveCategory(category).then(onCategorySavedReturned, this.OnErrorCallback);
    }

    /**
     * Save a new or edited tag
     * @param tag
     */
    SaveTag(tag: Tag): void {
        let onCategorySavedReturned: (data: Tag) => void;
        onCategorySavedReturned = (data: Tag) => {
            this.Tag = data;
            this._notificationService.Success(`Post "${tag.Name}" was succesfully published.`);
        };

        this._blogService.SaveTag(tag, this.AntiForgeryToken).then(onCategorySavedReturned, this.OnErrorCallback);
    }

    /**
     * Retrieve a tag by Id
     * @param tagId
     */
    RetrieveTag(tagId: number): void {
        throw new Error("Retrieve tag has not been implemented");
    }

    /**
     * Initial tags if we are on the manage content page
     */
    private initTags(): void {

        // get categories and tags as needed
       if (this._location.path().toLowerCase().indexOf("/tag/add") > -1 // retrieve an individual category
            || this._location.path().toLowerCase().indexOf("/tag/edit") > -1) {

            let onTagReturned: (category: Tag) => void = (category: Tag): void => {
                this.Tag = category;

                if (this.Tag == null) {
                    this._notificationService.Error(`A tag with Id: ${this.$routeParams.tagId} could not be returned`);
                } else {
                    this._notificationService.Success(`The tag with Id: ${this.$routeParams.tagId} was found.`);
                }
            };

            this._blogService.RetrieveTag(this.$routeParams.tagId).then(onTagReturned, function(){
                console.log("Error retrieving tags");
            });
        }
    }

    /**
     * Initial categories if we are on the manage content page
     */
    private initCategories(): void {

        if (this._location.path().toLowerCase().indexOf("/category/edit") > -1) {  // Retrieve an individual category

            let onCategoryReturned: (category: Category) => void = (category: Category): void => {
                this.Category = category;

                if (this.Category == null) {
                    this._notificationService.Error(`A category with Id: ${this.$routeParams.categoryId} could not be returned`);
                } else {
                    this._notificationService.Success(`The category with Id: ${this.$routeParams.categoryId} was found.`);
                }
            };

            this._blogService.RetrieveCategory(this.$routeParams.categoryId).then(onCategoryReturned, function () {
                console.log("error retrieving categories");
            });
        } else if (this._location.path().toLowerCase().indexOf("/category/add") > -1) { // New-Up a new category if we only have an add
            this.Category = new Category();
        }
    }

    /**
     * Initialize posts, categories and tags
     * @param $route
     * @param $location
     */
    private initRouteParams(): void {
        // get route params
        let currentPath:string = this._location.path();

        if (this.$route) {

            // post with a post Id
            if (this.$routeParams.postId) {
                this.RetrievePost(this.$routeParams.postId);
            }

            // tag URL Slug
            if (this.$routeParams.tagUrlSlug) {
                this.RetrieveTagUrlSlug(this.$routeParams.tagUrlSlug);
            }
        }
    }
}