import { BaseService } from "Core/Models/BaseService";
import { GridQuery } from "Core/Models/GridQuery";
import { ITagPosts } from "Blog/Tag/ITagPosts";
import { PagingProperties } from "Core/Models/PagingProperties";
import { PostQueryFilter } from "Blog/Post/PostQueryFilter";
import { Category } from "Blog/Category/Category";
import { Post } from "Blog/Post/Post";
import { Tag } from "Blog/Tag/Tag";
import { AuthService } from "Core/authorization/auth.service";

/**
 * Class for retrieving, creating and editing blog posts, categories and tags
 */
export class BlogService extends BaseService {

    private categoryEndPoint: string = "../category";
    private postEndPoint: string = "../post";
    private tagEndPoint: string = "../tag";

    constructor(private $http: ng.IHttpService, private authService: AuthService) {
        super();
    }

    /**
     * Get a post by ID
     * @param Id
     */
    RetrievePost(Id: number): ng.IPromise<void | Post> {

        let params:any = {
            postId: Id
        };

        let onPostReturned: (response: ng.IHttpPromiseCallbackArg<Post>) => Post = 
            (response: ng.IHttpPromiseCallbackArg<Post>) => {
            return <Post>response.data;
        };

        return this.$http.post(`${this.postEndPoint}/RetrieveById/${this.CreateWebAPIParams(params)}`, null).then(onPostReturned);
    }

    /**
     * Get a post by URL Slug
     * @param urlSlug
     */
    RetrievePostUrlSlug(urlSlug: string): ng.IPromise<void | Post> {

        return this.$http.get(`${this.postEndPoint}/retrieve?urlSlug=${urlSlug}`).then((response: ng.IHttpPromiseCallbackArg<Post>): Post => {
            return <Post>response.data;
        }, this.OnErrorCallback);
    }

    /**
     * Retrieve a list of posts via a category id
     * @param categoryId
     */
    RetrievePostsByCategoryId(categoryId: number): ng.IPromise<void | Array<Post>> {

        let params:any = {
            categoryId: categoryId
        };

        let onCategoryPostsReturned: (response: ng.IHttpPromiseCallbackArg<Array<Post>>) => Array<Post> | undefined =

            (response: ng.IHttpPromiseCallbackArg<Array<Post>>) => {
                return response.data;
            };

        return this.$http.post(`${this.postEndPoint}/RetrieveCategoryPosts/${this.CreateWebAPIParams(params)}`,
            params).then(onCategoryPostsReturned, this.OnErrorCallback);
    }

    /**
     * Retrieve paged post data
     * @param pagingProperties
     */
    RetrievePostsGridData(pagingProperties: PagingProperties, filter: PostQueryFilter): ng.IPromise<void | GridQuery<Post>> {

        let query: GridQuery<Post> = new GridQuery<Post>();

        if (pagingProperties === null) {
            pagingProperties = new PagingProperties();
        }

        if (filter === null) {
            filter = new PostQueryFilter();
        }

        query = {
            Filter: filter,
            PagingProperties: pagingProperties,
            Results: []
        };

        let onPostsReturned: (response: ng.IHttpPromiseCallbackArg<GridQuery<Post>>) => GridQuery<Post> | undefined
            = (response: ng.IHttpPromiseCallbackArg<GridQuery<Post>>) => {
                return response.data;
            };

        return this.$http.post(`${this.postEndPoint}/RetrievePosts`, query, this.ConfigAppJson).then(onPostsReturned, this.OnErrorCallback);
    }

    /**
     * Retrieve paged category data
     * @param pagingProperties
     */
    RetrieveCategoriesGridData(pagingProperties: PagingProperties): ng.IPromise<void | GridQuery<Category>> {

        let query: GridQuery<Category> = new GridQuery<Category>();

        if (pagingProperties === null) {
            pagingProperties = new PagingProperties();
        }

        query.PagingProperties = pagingProperties;

        // defining callback within function
        let onCategoriesReturned: (response: ng.IHttpPromiseCallbackArg<GridQuery<Category>>) => GridQuery<Category> | undefined
            = (response: ng.IHttpPromiseCallbackArg<GridQuery<Category>>) => {
                return response.data;
            };

        return this.$http.post(`${this.categoryEndPoint}/RetrieveCategories`, query, this.ConfigAppJson)
            .then(onCategoriesReturned, this.OnErrorCallback);
    }

    /**
     * Retrieve all categories
     */
    RetrieveAllCategories(includePosts: boolean): ng.IPromise <void | Array<Category>> {

        let params:any = {
            includePosts: includePosts
        };

        // defining callback within function
        let onCategoriesReturned: (response: ng.IHttpPromiseCallbackArg<Array<Category>>) => Array<Category> | undefined
            = (response: ng.IHttpPromiseCallbackArg<Array<Category>>) => {
                return response.data;
            };

        return this.$http.post(`${this.categoryEndPoint}/RetrieveAllCategories/${this.CreateWebAPIParams(params)}`,
            null).then(onCategoriesReturned, this.OnErrorCallback);
    }

    /**
     * Retrieve a category based on a category ID
     * @param categoryId
     */
    RetrieveCategory(categoryId: number): ng.IPromise<void | Category> {

        let params:any = {
            categoryId: categoryId
        };

        // defining callback within function
        let onCategoryReturned: (response: ng.IHttpPromiseCallbackArg<Category>) => Category | undefined
            = (response: ng.IHttpPromiseCallbackArg<Category>) => {
                return response.data;
            };

        return this.$http.post(`${this.categoryEndPoint}/RetrieveCategory/${this.CreateWebAPIParams(params)}`,
            null).then(onCategoryReturned, this.OnErrorCallback);
    }

    /**
     * Retrieve all tags
     */
    RetrieveAllTags(): ng.IPromise<void | Array<Tag>> {
        // defining callback within function
        let onCategoriesReturned: (response: ng.IHttpPromiseCallbackArg<Array<Tag>>) => Array<Tag> | undefined
            = (response: ng.IHttpPromiseCallbackArg<Array<Tag>>) => {
                return response.data;
            };

        return this.$http.post(`${this.tagEndPoint}/RetrieveAllTags`, null).then(onCategoriesReturned, this.OnErrorCallback);
    }

    /**
     * Retrieve paged tag values
     * @param pagingProperties
     */
    RetrieveTagsGridData(pagingProperties: PagingProperties): ng.IPromise<void | GridQuery<Tag>> {
        let query: GridQuery<Tag> = new GridQuery<Tag>();

        if (pagingProperties === null) {
            pagingProperties = new PagingProperties();
        }

        query.PagingProperties = pagingProperties;

        // defining callback within function
        let onTagsReturned: (response: ng.IHttpPromiseCallbackArg<GridQuery<Tag>>) => GridQuery<Tag> | undefined
            = (response: ng.IHttpPromiseCallbackArg<GridQuery<Tag>>) => {
                return response.data;
            };

        return this.$http.post(`${this.tagEndPoint}/RetrieveTags`, query, this.ConfigAppJson).then(onTagsReturned, this.OnErrorCallback);
    }

    /**
     * Retrieve all posts based on a tag slug
     * @param urlSlug
     */
    RetrieveTagUrlSlug(urlSlug: string): ng.IPromise<ITagPosts> {
        throw new Error("Not implemented");
    }

    /**
     * Save a blog post
     * @param post
     */
    SavePost(post: Post, publishPost: boolean, antiForgeryToken: string): ng.IPromise<void | Post>{

        let publishparams: any = {
            publishPost: publishPost
        };

        let onSaveReturned: (response: ng.IHttpPromiseCallbackArg<Post>) => Post = (response: ng.IHttpPromiseCallbackArg<Post>) => {
                return <Post>response.data;
            };

        return this.$http.post(`${this.postEndPoint}/Save/${this.CreateWebAPIParams(publishparams)}`, post)
            .then(onSaveReturned, this.OnErrorCallback);
    }

    /**
     * Unpublish a post
     * @param postId
     */
    UnpublishPost(postId: number, antiForgeryToken: string): ng.IPromise<void | Post> {
        let params: any = {
            postId: postId
        };


        // defining callback within function
        let onPostReturned: (response: ng.IHttpPromiseCallbackArg<Post>) => Post
            = (response: ng.IHttpPromiseCallbackArg<Post>) => {
                return <Post>response.data;
            };

        return this.$http.post(`${this.postEndPoint}/UnpublishPost/${this.CreateWebAPIParams(params)}`, null)
            .then(onPostReturned, this.OnErrorCallback);
    }

    /**
     * Publish a post by postId
     * @param postId
     * @param antiForgeryToken
     */
    PublishPost(postId: number, antiForgeryToken: string): ng.IPromise<void | Post> {
        let params: any = {
            postId: postId
        };

        // defining callback within function
        let onTagsReturned: (response: ng.IHttpPromiseCallbackArg<Post>) => Post
            = (response: ng.IHttpPromiseCallbackArg<Post>) => {
                return <Post>response.data;
            };

        return this.$http.post(`${this.postEndPoint}/PublishPost/${this.CreateWebAPIParams(params)}`, null)
            .then(onTagsReturned, this.OnErrorCallback);
    }

    /**
     * Save a new or edit category
     * @param categoryId
     * @param antiForgeryToken
     */
    SaveCategory(category: Category): ng.IPromise<void | Category> {

        // defining callback within function
        let onSaveCategoryReturned: (response: ng.IHttpPromiseCallbackArg<Category>) => Category
            = (response: ng.IHttpPromiseCallbackArg<Category>) => {
                return <Category>response.data;
            };

        return this.$http.post(`${this.categoryEndPoint}/Save/`, category)
            .then(onSaveCategoryReturned, this.OnErrorCallback);
    }

    /**
     * Save a new or edited tag
     * @param tagId
     * @param antiforgeryTokenn
     */
    SaveTag(tag: Tag, antiforgeryToken: string): ng.IPromise<void | Tag> {

        let params:any = {
            tag: tag
        };

        let config:ng.IRequestShortcutConfig = this.ConfigAntiForgery(antiforgeryToken);

        let onSaveCategoryReturned: (response: ng.IHttpPromiseCallbackArg<Tag>) => Tag | undefined
            = (response: ng.IHttpPromiseCallbackArg<Tag>) => {
                return response.data;
            };

        return this.$http.post(`${this.tagEndPoint}/Save`, params, config).then(onSaveCategoryReturned, this.OnErrorCallback);
    }

    /**
     * Retrieve a tag by Id
     * @param tagId
     */
    RetrieveTag(tagId: number): ng.IPromise<void | Tag> {

        let params:any = {
            tagId: tagId
        };

        // defining callback within function
        let onRetrieveTagReturned: (response: ng.IHttpPromiseCallbackArg<Tag>) => Tag
            = (response: ng.IHttpPromiseCallbackArg<Tag>) => {
                return <Tag>JSON.parse(<any>response.data);
            };

        return this.$http.post(`${this.tagEndPoint}/RetrieveTag`, params).then(onRetrieveTagReturned, this.OnErrorCallback);
    }
}