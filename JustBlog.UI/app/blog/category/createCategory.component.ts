import { BlogService } from "blog/blog.service";
import { Category } from "blog/category/Category";
import { Post } from "blog/post/Post";
import { ComponentBase } from "core/component.base";
import { BaseController } from "core/models/BaseController";
import { NotificationFactory } from "../../notification/notification.factory";

export const CreateCategoryComponentName: string = "createcategory";

// define the bindings for my component
interface ICreateCategoryControllerBindings { }

// define the interface of the component controller
interface ICreateCategoryComponentController extends ICreateCategoryControllerBindings { }

/**
 * Controller for MyComponent
 */
class CreateCategoryComponentController extends BaseController implements ICreateCategoryComponentController, ng.IController {

    AllCategories: Array<Category>;
    CategoryPosts: Array<Post>;

    static $inject = ["$sce", "blogService", "notificationService"]
    constructor($sce: ng.ISCEService, private blogService: BlogService, private notificationService: NotificationFactory) {
        super($sce);
    }

    $onInit?(): void {
        //this.GetCategories();
    }

    /**
     * Retrieve all categores available for the app
     */
    private GetCategories() {

        let onCategoriesReturned: (categories: Array<Category>) => void = (categories: Array<Category>): void => {
            console.log("categories returned")
        };

        this.blogService.RetrieveAllCategories(true).then(onCategoriesReturned, this.OnErrorCallback);
    }

    /**
     * Save a category
     * @param category
     */
    SaveCategory(category: Category): void {
        let onCategorySavedReturned: (data: Category) => void;
        onCategorySavedReturned = (data: Category) => {
            this.notificationService.Success(`Post "${category.Name}" was succesfully saved.`);
        };

        this.blogService.SaveCategory(category).then(onCategorySavedReturned, this.OnErrorCallback);
    }
}

/**
 * MyComponent Panel
 */
export class CreateCategoryComponent extends ComponentBase {

    constructor() {
        super();

        this.bindings = {}

        this.controller = CreateCategoryComponentController;

        this.templateUrl = ["$element", "$attrs", ($element: ng.IAugmentedJQuery, $attrs: ng.IAttributes): string => {
            return require("blog/category/createCategory.html");
        }];
    }
}