import { Category } from "Blog/Category/Category";
import { Tag } from "Blog/Tag/Tag";

/**
 * Model for handling blog posts
 */
export class Post {
    CategoryId: number;
    Category: Category;
    Description: string;
    Id: number;
    Meta: string;
    Modified: Date;
    PostedOn: Date;
    Published: boolean;
    ShortDescription: string;
    Slug: string;
    Tags: Array<Tag>;
    Title: string;
    UrlSlug: string;

    constructor() {
        this.Tags = new Array<Tag>();
        this.Category = new Category();
    }
}