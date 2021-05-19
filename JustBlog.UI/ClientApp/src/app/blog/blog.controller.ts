import { Category } from "@uirouter/angularjs";
import { BaseController } from "../core/models/BaseController";
import { NotificationFactory } from "../notification/notification.factory";
import { BlogService } from "./blog.service";
import { Metadata } from "./metadata/MetaData";
import { Post } from "./post/Post";
import { Tag } from "./tag/Tag";
import { TagPosts } from "./tag/TagPosts";

/**
 * Controller for reading and writing blog posts
 */
export class BlogController extends BaseController {

    CurrentTag: TagPosts;
    Category: Category;
    MetaData: Metadata;
    Tag: Tag;

    static $inject = ["blogService", "$sce", "notificationFactory"];
    constructor( private _blogService: BlogService, $sce: ng.ISCEService, private _notificationService: NotificationFactory) {
        super($sce);

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
        let onTagPostReturned: (data: TagPosts) => void = (data: TagPosts): void => {
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
}
