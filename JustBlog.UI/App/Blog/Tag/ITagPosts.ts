import { Post } from "Blog/Post/Post";
import { Tag } from "Blog/Tag/Tag";

//Class for holding view of tags and their post data
export interface ITagPosts {
    Posts: Array<Post>;
    Tag: Tag;
}
