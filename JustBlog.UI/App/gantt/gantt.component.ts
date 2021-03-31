import { ComponentBase } from "core/component.base";
import { CoreService } from "core/core.service";
import { BaseController } from "core/models/BaseController";

import CpmWorkerPath from "worker-loader!./cpm.worker";

export const GanttComponentName = "gantt";

/**
 * Controller for the Navigation Bar
 */
class GanttComponentController extends BaseController implements ng.IController {

    static $inject = ["$sce", "$uibModal", "coreService"];
    constructor($sce: ng.ISCEService, private $uibModal: ng.ui.bootstrap.IModalService, private coreService: CoreService) {
        super($sce);
    }

    $onInit?(): void {

        const worker = new CpmWorkerPath();

        worker.postMessage("Start CPM now!");

        worker.onmessage = e => {
            const message = e.data;
            console.log(`[From Worker]: ${message}`);
        };

        worker.terminate();
    }
}

/**
 * Navigation Bar Header
 */
export class GanttComponent extends ComponentBase {

    constructor() {
        super();

        this.bindings = {}

        this.controller = GanttComponentController;

        this.templateUrl = ["$element", "$attrs", ($element: ng.IAugmentedJQuery, $attrs: ng.IAttributes): string => {
            return require("gantt/gantt.html");
        }];
    }
}