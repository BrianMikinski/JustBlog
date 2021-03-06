﻿import { BlogService } from "blog/blog.service";
import { Category } from "blog/category/Category";
import { CreatePostControllerBase } from "blog/post/CreatePostControllerBase";
import { Post } from "blog/post/Post";
import { Tag } from "blog/tag/Tag";
import { ComponentBase } from "core/component.base";
import { NotificationFactory } from "notification/notification.factory";

export const CreatePostComponentName: string = "newpost";

interface ICreatePostControllerBindings {
    postId: number;
}

interface ICreatePostComponentController extends ICreatePostControllerBindings { }

/**
 * Component for displaying posts
 */
class CreatePostComponentController extends CreatePostControllerBase implements ICreatePostComponentController, ng.IController {
   
    NewPostTag: Tag = new Tag();
    PostCategories: Array<Category>;
    PostTags: Array<Tag>;
    postId: number;
    post: Post;

    // set the tiny mce editor options
    tinymceOptions: any = {
        selector: "textarea",
        //theme: "advanced",
        skin: false,
        //content_style: contentStyle.toString(),
        height: 500,
        //wwwroot\skins\ui\oxide
        //skin_url:  '/skins/ui/oxide',
        //plugins: ["print"],
        //plugins: ["advlist autolink lists link image charmap print preview hr anchor pagebreak",
        //    "searchreplace wordcount visualblocks visualchars code fullscreen",
        //    "insertdatetime media nonbreaking save table contextmenu directionality",
        //    "emoticons template paste textcolor colorpicker textpattern imagetools codesample toc"],
        //toolbar1: "undo redo | insert | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image",
        //toolbar2: "print preview media | forecolor backcolor emoticons | codesample",
        //image_advtab: true,
        //templates: [
        //    { title: "Test template 1", content: "Test 1" },
        //    //{ title: "Test template 2", content: "Test 2" }
        //],
        //content_css: [
        //    "//fonts.googleapis.com/css?family=Lato:300,300i,400,400i",
        //    "//www.tinymce.com/css/codepen.min.css"
        //],
        plugins: 'link image code',
        toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code'
    };

    tinymceContent: string;

    static $inject = ["blogService", "$sce", "notificationFactory"]
    constructor(private blogService: BlogService,
        public $sce: ng.ISCEService,
        private notificationFactory: NotificationFactory) {
        super(blogService, $sce, notificationFactory);
    }

    $onInit?(): void {

        //this.postId = (<ICreatePostControllerBindings>this.$stateParams).postId;

        // create a new post page
        //if (this.postId === null || this.postId === undefined) {
        //    this.Post = new Post();
        //} else {

        //    let onPostReturned: (response: void | Post) => void = (response: void | Post) => {
        //        let returnedPost: Post = <Post>response;

        //        if (returnedPost) {
        //            this.Post = <Post>response;
        //        } else {
        //            console.log("Could not retrieve the spcified post.")
        //            this.Post = new Post();
        //        }
        //    };

        //    this.blogService.RetrievePost(this.postId).then(onPostReturned, this.OnErrorCallback);
        //}

        this.post = new Post();


        // all categories for a post
        let onCategoriesReturned: (response: void | Array<Category>) => void = (response: void | Array<Category>) => {
            this.PostCategories = <Array<Category>>response;
        };

        // all tags for a post
        let onTagsReturned: (response: void | Array<Tag>) => void = (response: void | Array<Tag>) => {
            this.PostTags = <Array<Tag>>response;
        };

        this.blogService.RetrieveAllCategories(false).then(onCategoriesReturned, this.OnErrorCallback);
        this.blogService.RetrieveAllTags().then(onTagsReturned, this.OnErrorCallback);
    }

    /**
     * Add a tag to a post model object
     * @param $model
     */
    AddTagToPost(): void {
        if (this.Post.Tags.indexOf(this.NewPostTag) === -1
            && this.NewPostTag.Id != null) {
            this.Post.Tags.push(this.NewPostTag);
        }
    }

    /**
     * Remove a tag from a post
     * @param tag
     */
    RemoveTagFromPost(tag: Tag): void {
        if (this.Post.Tags.indexOf(tag) > -1) {
            let index: number = this.Post.Tags.indexOf(tag);
            this.Post.Tags.splice(index, 1);
        }
    }

    /**
     * Create a new post
     */
    SavePost(post: Post, publishPost: boolean): void {

        let onPostSavedReturned: (data: Post) => void;
        onPostSavedReturned = (data: Post) => {

            if (data != null) {
                this.Post = data;
            }

            if (publishPost === false && data !== undefined) {
                this.notificationFactory.Success(`Post "${this.Post.Title}" was succesfully saved.`);
            } else if (publishPost === true && data !== undefined) {
                this.notificationFactory.Success(`Post "${this.Post.Title}" was succesfully published.`);
            } else {
                this.notificationFactory.Error(`Post "${this.Post.Title}" could not be saved or published.`);
            }
        };

        this.blogService.SavePost(post, publishPost, this.AntiForgeryToken).then(onPostSavedReturned, this.OnErrorCallback);
    }

    /**
     * A posts category
     * @param postCategory
     */
    SetPostCategory(postCategory: Category): void {
        if (postCategory) {
            this.Post.Category = postCategory;
        }
    }
}

export class CreatePostComponent extends ComponentBase {
    constructor() {
        super();

        this.bindings = {}
        this.controller = CreatePostComponentController;
        this.controllerAs = "$createPostCtrl";

        this.templateUrl = ["$element", "$attrs", ($element: ng.IAugmentedJQuery, $attrs: ng.IAttributes): string => {
            return require("blog/post/createPost.html");
        }];
    }
}