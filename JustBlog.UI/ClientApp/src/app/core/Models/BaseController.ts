import { SortField } from "../grid/SortField";

/**
 * Base Controller class for handling errors that may occure in controller
 */
export abstract class BaseController {

    // error handling callbacks
    private errorMessage: string = "An error has been encountered in this controller.";
    public OnErrorCallback: (error: any) => void;
    public AntiForgeryToken: string;

    inject = ["$sce"]
    constructor(public $sce: ng.ISCEService) {

        let onErrorCallBack = (data: any) => {
            console.log(this.errorMessage);
        };

        this.OnErrorCallback = onErrorCallBack;
    }

    /**
     * Set the base errorMessage
     * @param message
     */
    SetErrorMessage(message: string): void {
        this.errorMessage = message;
    }

    /**
     * Convert a date time object to mm/dd/yyyy
     */
    ConvertDateTime(time: string): string {

        if (time !== null) {

            let convertedDateTime: Date = new Date(time);
            let mm: number = convertedDateTime.getMonth() + 1;
            let dd: number = convertedDateTime.getDay();
            let year: number = convertedDateTime.getFullYear();

            return `${mm}/${dd}/${year}`;
        } else {
            throw new Error("Date conversion error: time parameter cannot be null.");
        }
    }

    /**
     * Parse a json date to a javascript date time object
     * @param jsonDateString
     */
    ParseJsonDate(jsonDateString: string) {
        if (jsonDateString) {
            return new Date(parseInt(jsonDateString.replace("/Date(", "")));
        } else {
            return null;
        }
    }

    /**
     * Mark html content as trusted
     * @param content
     */
    ToTrustedHtml(htmlContent: string): string {
        return this.$sce.trustAsHtml(htmlContent);
    }

    /*
     * Callback used by controllers to assign the Anti Forgery Token
     */
    AntiForgeryCallback: (antiForgeryToken: string) => void = (antiForgeryToken: string) => {
        this.AntiForgeryToken = antiForgeryToken;
    };

    /**
     * Function for determining if a field is sorted in the correct. Use "isAlphabetic" to
     * determine the icon style type.
     * direction
     * @param SortFields
     */
    SortFieldIsAscending(field: string, SortFields: Array<SortField>, isAlphabetic: boolean): string {

        let glyphiconSortAlphabet: string = "glyphicon-sort-by-alphabet";
        let glphyiconSortAlphabetAlt: string = "glyphicon-sort-by-alphabet-alt";
        let glphyiconSortByOrder: string = "glyphicon-sort-by-order";
        let glphyiconSortByOrderAlt: string = "glyphicon-sort-by-order-alt";
        let glphyiconSortByAttributes: string = "glyphicon-sort-by-attributes";
        let glphyiconSortByAttributesAlt: string = "glyphicon-sort-by-attributes-alt";
        let glphyiconUnsortedIcon: string = "glyphicon-sort";

        for (let i in SortFields) {

            let currentField: SortField = SortFields[i];

            if (currentField.Field === field) {

                if (isAlphabetic === true) {
                    return this.sortFieldIcon(currentField.IsAscending, glphyiconSortAlphabetAlt, glyphiconSortAlphabet);
                } else if (isAlphabetic === false) {
                    return this.sortFieldIcon(currentField.IsAscending, glphyiconSortByOrder, glphyiconSortByOrderAlt);
                } else if (isAlphabetic === null) {
                    return this.sortFieldIcon(currentField.IsAscending, glphyiconSortByAttributes, glphyiconSortByAttributesAlt);
                } else {
                    throw new Error("Error trying to determine the sort type");
                }
            }
        }

        return glphyiconUnsortedIcon;
    }

    /**
     * Return the correct field
     * @param isAlphabetic
     */
    private sortFieldIcon(isAscending: boolean, glphyiconType: string, glphyiconAltType: string): string {

        if (isAscending === false) {
            return glphyiconType;
        }

        return glphyiconAltType;
    }

    /**
     * Rotate a sort field
     */
    protected RotateSortField(field: string, SortFields: Array<SortField>): Array<SortField> {
        let fieldFound: boolean = false;

        // remove white space
        if (field != null) {
            field.trim();
        }

        // rotate the current field if we have it
        for (let i = 0; i < SortFields.length; i++) {

            let currentField = SortFields[i];

            if (currentField.Field === field) {
                fieldFound = true;

                if (currentField.IsAscending === true) {
                    currentField.IsAscending = false;
                } else if (currentField.IsAscending === false) {
                    SortFields.splice(i, 1);
                }
            }
        }

        // add a new field if we don't have know
        if (fieldFound === false) {

            let newSortField = new SortField();

            newSortField.Field = field;
            newSortField.IsAscending = true;

            SortFields.push(newSortField);
        }

        return SortFields;
    }

    /**
     * Replace a sort field or rotate if the current one has been added
     * @param field
     * @param SortFields
     */
    protected ClearOrReplaceField(field: string, SortFields: Array<SortField>): Array<SortField> {

        // remove whitespace
        if (field != null) {
            field.trim();
        }

        // update the row if it is not found.
        if (SortFields != null && SortFields.length > 0) {

            for (let i = 0; i < SortFields.length; i++) {

                let currentField: SortField = SortFields[i];

                if (currentField.Field === field) {

                    let newFields: Array<SortField> = new Array<SortField>();

                    if (currentField.IsAscending === true) {
                        currentField.IsAscending = false;
                    } else {
                        currentField.IsAscending = true;
                    }

                    newFields.push(currentField);

                    return newFields;
                }
            }

            return this.addnewSortFields(field);
        } else {
            return this.addnewSortFields(field);
        }
    }

    /**
     * Create a new array of sort fields with 1 element
     */
    private addnewSortFields(field: string): Array<SortField> {
        let newFields: Array<SortField> = new Array<SortField>();
        let newField: SortField = new SortField();
        newField.Field = field;
        newField.IsAscending = true;

        newFields.push(newField);

        return newFields;
    }
}
