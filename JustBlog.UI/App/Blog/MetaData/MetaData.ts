import { Post } from "Blog/Post/Post";

/**
 * Container for global blog meta data
 */
export class MetaData {
    Author: string;
    AdminEmail: string;
    Description: string;
    Domain: string;
    Facebook: string;
    Posts: Array<Post>;
    Github: string;
    Motto: string;
    Title: string;
    Twitter: string;
    URL: string;
    XMLFeed: string;
}