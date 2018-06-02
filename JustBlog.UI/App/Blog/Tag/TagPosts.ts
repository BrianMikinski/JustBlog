import {ITagPosts} from "./ITagPosts";
import { Post } from "Blog/Post/Post";
import { Tag } from "Blog/Tag/Tag";

export class TagPosts implements ITagPosts {
    Posts: Array<Post>;
    Tag: Tag;
}