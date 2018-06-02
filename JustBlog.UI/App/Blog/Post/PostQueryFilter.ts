import {IQueryFilter} from "Core/Interfaces/IQueryFilter";

/**
 * Query filter for post grid view queries
 */
export class PostQueryFilter implements IQueryFilter {
    IsPublished: boolean;
}