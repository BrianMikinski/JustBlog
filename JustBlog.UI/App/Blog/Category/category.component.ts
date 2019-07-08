import { BlogService } from "Blog/blog.service";
import { Category } from "Blog/category/Category";
import { Post } from "Blog/post/Post";
import { ComponentBase } from "Core/component.base";
import { CoreService } from "Core/core.service";
import { BaseController } from "Core/Models/BaseController";

export const CategoryComponentName: string = "category";

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

    inject = ["coreService", "blogService", "$sce"]
    constructor(private coreService: CoreService, private blogService: BlogService, public $sce: ng.ISCEService) {
        super($sce);
    }

    $onInit?(): void {
        this.GetCategories();
    }

    /**
     * Retrieve all categores available for the app
     */
    private GetCategories() {

        let onCategoriesReturned: (categories: Array<Category>) => void = (categories: Array<Category>): void => {
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
        let onCategoryPostsReturned: (categoryPosts: Array<Post>) => void = (categoryPosts: Array<Post>): void => {
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
            return require("Blog/category/categories.html");
        }];
    }
}