﻿import { BlogService } from "blog/blog.service";
import { Post } from "blog/post/Post";
import { ComponentBase } from "core/component.base";
import { BaseController } from "core/models/BaseController";

export const PostComponentName: string = "post";

interface IPostControllerBindings {
    urlSlug: string;
}
interface IPostComponentController extends IPostControllerBindings { }

/**
 * Component for create posts
 */
class PostComponentController extends BaseController implements IPostComponentController, ng.IController {

    private Post: Post;
    urlSlug: string;

    static $inject = ["blogService", "$window", "$sce", "$stateParams"]
    constructor(private blogService: BlogService,
        private $window: ng.IWindowService,
        public $sce: ng.ISCEService,
        private $stateParams: ng.ui.IStateParamsService) {
        super($sce);
    }

    $onInit?(): void {
        this.urlSlug = (<IPostControllerBindings>this.$stateParams).urlSlug;

        if (this.urlSlug !== undefined) {
            this.RetrievePostUrlSlug(this.urlSlug);
        }
    }
    
    /**
     * Get a post by urlSlug
     * @param urlSlug
     */
    private RetrievePostUrlSlug(urlSlug: string): void {

       let  onPostReturned: (data: Post) => void = (data: Post): void => {
            this.Post = new Post();
            this.Post = data;

            if (this.Post.Title) {
                this.setTitle(this.Post.Title);
            }
        }

        this.blogService.RetrievePostUrlSlug(urlSlug).then(onPostReturned, this.OnErrorCallback);
    }

    /**
     * Set the title of the current page
     * @param title
     */
    private setTitle(title: string): void {
        if (title) {
            this.$window.document.title = this.$window.document.title + " - " + title;
        }
    }
}

export class PostComponent extends ComponentBase {
    constructor() {
        super();

        this.bindings = {}
        this.controller = PostComponentController;
        this.controllerAs = "$postCtrl";

        this.templateUrl = ["$element", "$attrs", ($element: ng.IAugmentedJQuery, $attrs: ng.IAttributes): string => {
            return require("blog/post/post.html");
        }];
    }
}