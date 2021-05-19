import { Post } from "../post/Post";
import { Tag } from "./Tag";

//Class for holding view of tags and their post data
export interface TagPosts {
    Posts: Array<Post>;
    Tag: Tag;
}
