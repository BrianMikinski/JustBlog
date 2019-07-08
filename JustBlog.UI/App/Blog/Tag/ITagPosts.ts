import { Post } from "Blog/post/Post";
import { Tag } from "Blog/tag/Tag";

//Class for holding view of tags and their post data
export interface ITagPosts {
    Posts: Array<Post>;
    Tag: Tag;
}
