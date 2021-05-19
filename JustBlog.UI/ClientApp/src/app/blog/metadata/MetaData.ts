import { Post } from "../post/Post";

/**
 * Container for global blog meta data
 */
export class Metadata {
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
