import { Post } from "blog/post/Post";
import { Tag } from "blog/tag/Tag";

//Class for holding view of tags and their post data
export interface ITagPosts {
    Posts: Array<Post>;
    Tag: Tag;
}
