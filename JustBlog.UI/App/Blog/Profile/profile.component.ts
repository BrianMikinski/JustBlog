import { MetaData } from "Blog/MetaData/MetaData";
import { ComponentBase } from "Core/component.base";
import { CoreService } from "Core/core.service";
import { BaseController } from "Core/Models/BaseController";

export const ProfileComponentName: string = "profile";

// define the bindings for my component
interface IProfileControllerBindings { }

// define the interface of the component controller
interface IProfileComponentController extends IProfileControllerBindings { }

/**
 * Controller for MyComponent
 */
class ProfileComponentController extends BaseController implements IProfileComponentController, ng.IController {

    private MetaData: MetaData;

    inject = ["coreService", "$sce"]
    constructor(private coreService: CoreService, public $sce: ng.ISCEService) {
        super($sce);

        let OnErrorCallback = (reason: any) => {
            console.log(`Error encountedered profile controller`)
        };
    }

    /**
     * Function called when controller is initialized
     */
    $onInit?(): void {

        let metaDataCallBack: (data: MetaData) => void = (data: MetaData) => {
            this.MetaData = data;
        };

        this.coreService.GetMetaData().then(metaDataCallBack, this.OnErrorCallback);
    }
}

/**
 * MyComponent Panel
 */
export class ProfileComponent extends ComponentBase {

    constructor(/* inject services used by component here*/) {
        super();

        this.bindings = {}

        this.controller = ProfileComponentController;
        this.controllerAs = "$profileCtrl"

        this.templateUrl = ["$element", "$attrs", ($element: ng.IAugmentedJQuery, $attrs: ng.IAttributes): string => {
            return require("Blog/profile/profile.html");
        }];
    }
}