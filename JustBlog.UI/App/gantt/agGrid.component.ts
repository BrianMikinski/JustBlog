import { ComponentBase } from "core/component.base";
import { CoreService } from "core/core.service";
import { BaseController } from "core/models/BaseController";
import { Grid, GridOptions, ModuleRegistry } from "@ag-grid-community/all-modules";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import "@ag-grid-community/all-modules/dist/styles/ag-grid.min.css";
import "@ag-grid-community/all-modules/dist/styles/ag-theme-alpine.min.css";

//import { ColumnDef } from 

export const agGridComponentName = "agGridComponent";

ModuleRegistry.register(ClientSideRowModelModule);

/**
 * Controller for the Navigation Bar
 */
class AGGridpComponentController extends BaseController implements ng.IController {


    private gridOptions: GridOptions = <GridOptions>{};


    static $inject = ["$sce", "$uibModal", "coreService"];
    constructor($sce: ng.ISCEService, private $uibModal: ng.ui.bootstrap.IModalService, private coreService: CoreService) {
        super($sce);

        this.gridOptions = {
            columnDefs: this.createColumnDefs(),
            rowData: this.createRowData()
        };

        let eGridDiv = <HTMLElement>document.querySelector('#myGrid');
        new Grid(eGridDiv, this.gridOptions);
    }

    $onInit?(): void {

    }

    private createColumnDefs() {
        return [
            { field: "make" },
            { field: "model" },
            { field: "price" }
        ];
    }

    // specify the data
    private createRowData() {
        return [
            { make: "Toyota", model: "Celica", price: 35000 },
            { make: "Ford", model: "Mondeo", price: 32000 },
            { make: "Porsche", model: "Boxter", price: 72000 }
        ];
    }
}

/**
 * Navigation Bar Header
 */
export class AGGridComponent extends ComponentBase {

    constructor() {
        super();

        this.bindings = {}

        this.controller = AGGridpComponentController;

        this.templateUrl = ["$element", "$attrs", ($element: ng.IAugmentedJQuery, $attrs: ng.IAttributes): string => {
            return require("gantt/agGrid.html");
        }];
    }
}