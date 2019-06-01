import {SortField} from "Core/grid/SortField";

/**
 * Properties to define a paging object
 */
export class PagingProperties {
    DEFAULT_PAGE_SIZE: number = 10;
    Index: number;
    PageSize: number;
    TotalPages: number;
    TotalResults: number;
    SortFields: Array<SortField>;

    constructor() {
        this.SortFields = new Array<SortField>();
    }
}