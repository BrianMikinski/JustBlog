import { BlogService } from "Blog/blog.service";
import { Category } from "Blog/category/Category";
import { ComponentBase } from "core/component.base";
import { GridQuery } from "core/grid/GridQuery";
import { BaseController } from "core/models/BaseController";

export const CategoriesGridComponentName: string = "categoriesgrid";

/**
 * Component for displaying posts
 */
class CategoriesGridComponentController extends BaseController implements ng.IController {

    private Categories: GridQuery<Category>;

    inject = ["blogService", "$sce"]
    constructor(private blogService: BlogService,
        public $sce: ng.ISCEService) {
        super($sce);
    }

    $onInit?(): void {
        this.Categories = new GridQuery<Category>();
        this.CategoriesPageAndSort(1, "Modified");
    }

    /**
     * Change the page of the categories
     * @param pageNumber
     */
    CategoriesPageAndSort(pageNumber: number, field: string): void {
        if (pageNumber != null || field != null) {

            if (pageNumber !== null) {
                this.Categories.PagingProperties.Index = pageNumber - 1;
            }

            if (field !== null) {
                this.Categories.PagingProperties.SortFields = this.ClearOrReplaceField(field, this.Categories.PagingProperties.SortFields);
            }

            let onCategoriesReturned: (data: GridQuery<Category>) => void;
            onCategoriesReturned = (data: GridQuery<Category>) => {
                this.Categories = data;
            };

            this.blogService.RetrieveCategoriesGridData(this.Categories.PagingProperties)
                .then(onCategoriesReturned, this.OnErrorCallback);
        } else {
            throw Error("You must specify a page number or a field in order to page categories");
        }
    }
}

export class CategoriesGridComponent extends ComponentBase {
    constructor() {
        super();

        this.bindings = {}
        this.controller = CategoriesGridComponentController;
        this.controllerAs = "$categoriesGridCtrl";

        this.templateUrl = ["$element", "$attrs", ($element: ng.IAugmentedJQuery, $attrs: ng.IAttributes): string => {
            return require("Blog/category/categoriesGrid.html");
        }];
    }
}