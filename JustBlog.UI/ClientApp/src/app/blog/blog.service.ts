import { GridQuery } from "../core/grid/GridQuery";
import { PagingProperties } from "../core/grid/PagingProperties";
import { BaseService } from "../core/models/BaseService";
import { Category } from "./category/Category";
import { Post } from "./post/Post";
import { PostQueryFilter } from "./post/PostQueryFilter";
import { Tag } from "./tag/Tag";
import { TagPosts } from "./tag/TagPosts";

export const BlogServiceName: string = "blogService";

/**
 * Class for retrieving, creating and editing blog posts, categories and tags
 */
export class BlogService extends BaseService {

    private categoryEndPoint: string = "category";
    private postEndPoint: string = "post";
    private tagEndPoint: string = "tag";

    static $inject = ['$http','API_URL']
    constructor(private $http: ng.IHttpService, API_URL: string) {
      super();

      this.categoryEndPoint = `${API_URL}${this.categoryEndPoint}`;
      this.postEndPoint = `${API_URL}${this.postEndPoint}`;
      this.tagEndPoint = `${API_URL}${this.tagEndPoint}`;
    }

    /**
     * Get a post by ID
     * @param Id
     */
    RetrievePost(Id: number): ng.IPromise<void | Post> {

        let params:any = {
            postId: Id
        };

        let onPostReturned: (response: ng.IHttpResponse<Post>) => Post = 
            (response: ng.IHttpResponse<Post>) => {
            return <Post>response.data;
        };

        return this.$http.post(`${this.postEndPoint}/RetrieveById/${this.CreateWebAPIParams(params)}`, null).then(onPostReturned);
    }

    /**
     * Get a post by URL Slug
     * @param urlSlug
     */
    RetrievePostUrlSlug(urlSlug: string): ng.IPromise<void | Post> {

        return this.$http.get(`${this.postEndPoint}/retrieve?urlSlug=${urlSlug}`).then((response: ng.IHttpResponse<Post>): Post => {
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

        let onCategoryPostsReturned: (response: ng.IHttpResponse<Array<Post>>) => Array<Post> | undefined =

            (response: ng.IHttpResponse<Array<Post>>) => {
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

        let onPostsReturned: (response: ng.IHttpResponse<GridQuery<Post>>) => GridQuery<Post> | undefined
            = (response: ng.IHttpResponse<GridQuery<Post>>) => {
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
        let onCategoriesReturned: (response: ng.IHttpResponse<GridQuery<Category>>) => GridQuery<Category> | undefined
            = (response: ng.IHttpResponse<GridQuery<Category>>) => {
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
        let onCategoriesReturned: (response: ng.IHttpResponse<Array<Category>>) => Array<Category> | undefined
            = (response: ng.IHttpResponse<Array<Category>>) => {
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
        let onCategoryReturned: (response: ng.IHttpResponse<Category>) => Category | undefined
            = (response: ng.IHttpResponse<Category>) => {
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
        let onCategoriesReturned: (response: ng.IHttpResponse<Array<Tag>>) => Array<Tag> | undefined
            = (response: ng.IHttpResponse<Array<Tag>>) => {
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
        let onTagsReturned: (response: ng.IHttpResponse<GridQuery<Tag>>) => GridQuery<Tag> | undefined
            = (response: ng.IHttpResponse<GridQuery<Tag>>) => {
                return response.data;
            };

        return this.$http.post(`${this.tagEndPoint}/RetrieveTags`, query, this.ConfigAppJson).then(onTagsReturned, this.OnErrorCallback);
    }

    /**
     * Retrieve all posts based on a tag slug
     * @param urlSlug
     */
    RetrieveTagUrlSlug(urlSlug: string): ng.IPromise<TagPosts> {
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

        let onSaveReturned: (response: ng.IHttpResponse<Post>) => Post = (response: ng.IHttpResponse<Post>) => {
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
        let onPostReturned: (response: ng.IHttpResponse<Post>) => Post
            = (response: ng.IHttpResponse<Post>) => {
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
        let onTagsReturned: (response: ng.IHttpResponse<Post>) => Post
            = (response: ng.IHttpResponse<Post>) => {
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
        let onSaveCategoryReturned: (response: ng.IHttpResponse<Category>) => Category
            = (response: ng.IHttpResponse<Category>) => {
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

        let onSaveCategoryReturned: (response: ng.IHttpResponse<Tag>) => Tag | undefined
            = (response: ng.IHttpResponse<Tag>) => {
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
        let onRetrieveTagReturned: (response: ng.IHttpResponse<Tag>) => Tag
            = (response: ng.IHttpResponse<Tag>) => {
                return <Tag>JSON.parse(<any>response.data);
            };

        return this.$http.post(`${this.tagEndPoint}/RetrieveTag`, params).then(onRetrieveTagReturned, this.OnErrorCallback);
    }
}
