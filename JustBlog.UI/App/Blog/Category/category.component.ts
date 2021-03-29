import { BlogService } from "blog/blog.service";
import { Category } from "blog/category/Category";
import { Post } from "blog/post/Post";
import { ComponentBase } from "core/component.base";
import { BaseController } from "core/models/BaseController";

export const CategoryComponentName = "category";

// define the bindings for my component
interface ICategoryControllerBindings { }

// define the interface of the component controller
interface ICategoryComponentController extends ICategoryControllerBindings { }

/**
 * Controller for MyComponent
 */
class CategoryComponentController extends BaseController implements ICategoryComponentController, ng.IController {

    AllCategories: Array<Category>;
    CategoryPosts: Array<Post>;

    static $inject = ["blogService", "$sce"]
    constructor(private blogService: BlogService, public $sce: ng.ISCEService) {
        super($sce);
    }

    $onInit?(): void {
        this.GetCategories();
    }

    /**
     * Retrieve all categores available for the app
     */
    private GetCategories() {

        const onCategoriesReturned: (categories: Array<Category>) => void = (categories: Array<Category>): void => {
            this.AllCategories = categories;

            if (this.AllCategories && this.AllCategories.length > 0) {
                this.RetrieveCategoryPosts(this.AllCategories[0].Id);
            }
        };

        this.blogService.RetrieveAllCategories(true).then(onCategoriesReturned, this.OnErrorCallback);
    }

    /**
     * Retrieve posts by category
     * @param categoryId
     */
    private RetrieveCategoryPosts(categoryId: number): void {
        const onCategoryPostsReturned: (categoryPosts: Array<Post>) => void = (categoryPosts: Array<Post>): void => {
            this.CategoryPosts = categoryPosts;
        }

        this.blogService.RetrievePostsByCategoryId(categoryId).then(onCategoryPostsReturned, this.OnErrorCallback);
    }
}

/**
 * MyComponent Panel
 */
export class CategoryComponent extends ComponentBase {

    constructor() {
        super();

        this.bindings = { }

        this.controller = CategoryComponentController;
        this.controllerAs = "$categoryCtrl"

        this.templateUrl = ["$element", "$attrs", ($element: ng.IAugmentedJQuery, $attrs: ng.IAttributes): string => {
            return require("blog/category/categories.html");
        }];
    }
}