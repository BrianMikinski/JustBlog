import { PagingProperties } from "./PagingProperties";
import { QueryFilter } from "./QueryFilter";

/**
 * Generic object to hold table queries
 */
export class GridQuery<T> {
    Filter: QueryFilter;
    PagingProperties: PagingProperties;
    Results: Array<T>;

    // maybe add generation of query filter here as well
    constructor() {
        this.PagingProperties = new PagingProperties();
        this.Results = new Array<T>();
    }
}
