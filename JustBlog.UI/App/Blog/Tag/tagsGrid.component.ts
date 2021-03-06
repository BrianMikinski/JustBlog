﻿import { BlogService } from "blog/blog.service";
import { Tag } from "blog/tag/Tag";
import { ComponentBase } from "core/component.base";
import { GridQuery } from "core/grid/GridQuery";
import { BaseController } from "core/models/BaseController";

export const TagsGridComponentName: string = "tagsgrid";

/**
 * Component for displaying posts
 */
class TagsGridComponentController extends BaseController implements ng.IController {

    private Tags: GridQuery<Tag> = new GridQuery<Tag>(); 

    static $inject = ["blogService", "$sce"]
    constructor(private blogService: BlogService,
        public $sce: ng.ISCEService) {
        super($sce);

        this.TagsPageAndSort(1, null);
    }

    $onInit?(): void;

    /**
     * Retrieve a grid view of the tags
     * @param pageNumber
     */
    private TagsPageAndSort(pageNumber: number, field: string | null): void {
        if (pageNumber || field != null) {

            if (pageNumber !== null) {
                this.Tags.PagingProperties.Index = pageNumber - 1;
            }

            if (field !== null) {
                this.Tags.PagingProperties.SortFields = this.ClearOrReplaceField(field, this.Tags.PagingProperties.SortFields);
            }

            // Callback
            let onTagsReturned: (data: GridQuery<Tag>) => void;
            onTagsReturned = (data: GridQuery<Tag>) => {
                this.Tags = data;
            };

            this.blogService.RetrieveTagsGridData(this.Tags.PagingProperties).then(onTagsReturned, this.OnErrorCallback);
        }
    }
}

export class TagsGridComponent extends ComponentBase {
    constructor() {
        super();

        this.bindings = {}
        this.controller = TagsGridComponentController;
        this.controllerAs = "$tagsGridCtrl";

        this.templateUrl = ["$element", "$attrs", ($element: ng.IAugmentedJQuery, $attrs: ng.IAttributes): string => {
            return require("blog/tag/tagsGrid.html");
        }];
    }
}