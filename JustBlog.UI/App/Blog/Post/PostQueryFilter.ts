import {QueryFilter} from "core/grid/QueryFilter";

/**
 * Query filter for post grid view queries
 */
export class PostQueryFilter implements QueryFilter {
    IsPublished: boolean;
}