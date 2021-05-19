import { ComponentBase } from "../../core/component.base";
import { CoreService } from "../../core/core.service";
import { BaseController } from "../../core/models/BaseController";
import { Metadata } from "../metadata/MetaData";


export const ProfileComponentName: string = "profile";

// define the bindings for my component
interface IProfileControllerBindings { }

// define the interface of the component controller
interface IProfileComponentController extends IProfileControllerBindings { }

/**
 * Controller for MyComponent
 */
class ProfileComponentController extends BaseController implements IProfileComponentController, ng.IController {

    private metadata: Metadata;

    static $inject = ["coreService", "$sce"]
    constructor(private coreService: CoreService, public $sce: ng.ISCEService) {
        super($sce);

        this.OnErrorCallback = (reason: any) => {
            console.log(`Error encountedered profile controller`);
        };
    }

    /**
     * Function called when controller is initialized
     */
    $onInit?(): void {

        let metaDataCallBack: (data: Metadata) => void = (data: Metadata) => {
            this.metadata = data;
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

        this.templateUrl = ["$element", "$attrs", ($element: ng.IAugmentedJQuery, $attrs: ng.IAttributes): string => {
            return require("blog/profile/profile.html");
        }];
    }
}
