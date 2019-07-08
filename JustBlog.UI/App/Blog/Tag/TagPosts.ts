import {ITagPosts} from "./ITagPosts";
import { Post } from "blog/Post/Post";
import { Tag } from "blog/tag/Tag";

export class TagPosts implements ITagPosts {
    Posts: Array<Post>;
    Tag: Tag;
}