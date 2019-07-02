import {IQueryFilter} from "Core/grid/IQueryFilter";
import {PagingProperties} from "Core/grid/PagingProperties";

/**
 * Generic object to hold table queries
 */
export class GridQuery<T> {
    Filter: IQueryFilter;
    PagingProperties: PagingProperties;
    Results: Array<T>;

    // maybe add generation of query filter here as well
    constructor() {
        this.PagingProperties = new PagingProperties();
        this.Results = new Array<T>();
    }
}