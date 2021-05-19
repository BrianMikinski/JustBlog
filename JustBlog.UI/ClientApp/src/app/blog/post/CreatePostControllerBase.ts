import { BaseController } from "../../core/models/BaseController";
import { NotificationFactory } from "../../notification/notification.factory";
import { BlogService } from "../blog.service";
import { Post } from "./Post";


export class CreatePostControllerBase extends BaseController {

    Post: Post;

    static $inject = ["blogService", "$sce", "notificationFactory"]
    constructor(private _blogService: BlogService,
        _$sce: ng.ISCEService,
        private _notificationFactory: NotificationFactory) {
        super(_$sce);
    }

    /**
     * Publish a post by postId
     * @param postId
     */
    PublishPost(post: Post): void {
        let onPostSavedReturned: (data: Post) => void;
        onPostSavedReturned = (data: Post) => {

            post.Published = data.Published;
            post.Modified = data.Modified;
            post.PostedOn = data.PostedOn;

            //post.PostedOn = new Date().toUTCString();
            this._notificationFactory.Success(`Post "${post.Title}" was succesfully published.`);
        };

        this._blogService.PublishPost(post.Id, this.AntiForgeryToken).then(onPostSavedReturned, this.OnErrorCallback);
    }

    /**
     * Unpublish the current post
     */
    UnpublishPost(post: Post): void {
        let onPostUnpublishedReturned: (data: Post) => void;
        onPostUnpublishedReturned = (data: Post) => {

            if (data !== undefined) {
                post.PostedOn = data.PostedOn;
                post.Published = data.Published;
                post.Modified = data.Modified;

                this.Post = data;

                this._notificationFactory.Success(`Post "${this.Post.Title}" was succesfully unpublished.`);
            } else {
                this._notificationFactory.Error(`Post "${this.Post.Title}" could not be unpublished.`);
            }

        }

        this._blogService.UnpublishPost(post.Id, this.AntiForgeryToken).then(onPostUnpublishedReturned, this.OnErrorCallback);
    }
}
