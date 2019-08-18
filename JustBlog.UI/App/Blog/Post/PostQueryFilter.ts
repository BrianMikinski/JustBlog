import {IQueryFilter} from "core/grid/IQueryFilter";

/**
 * Query filter for post grid view queries
 */
export class PostQueryFilter implements IQueryFilter {
    IsPublished: boolean;
}