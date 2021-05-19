import { ComponentBase } from "../../core/component.base";
import { BaseController } from "../../core/models/BaseController";
import { NotificationFactory } from "../../notification/notification.factory";
import { BlogService } from "../blog.service";
import { Category } from "./Category";

export const CreateCategoryComponentName: string = "createcategory";

interface ICreateCategoryControllerBindings { }

interface ICreateCategoryComponentController extends ICreateCategoryControllerBindings { }

/**
 * Create new category
 */
class CreateCategoryComponentController extends BaseController implements ICreateCategoryComponentController, ng.IController {

    category: Category;

    static $inject = ["$sce", "blogService", "notificationFactory"]
    constructor($sce: ng.ISCEService, private blogService: BlogService, private notificationFactory: NotificationFactory) {
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
            this.notificationFactory.Success(`Post "${category.Name}" was succesfully saved.`);
        };

        this.blogService.SaveCategory(category).then(onCategorySavedReturned, this.OnErrorCallback);
    }
}

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
