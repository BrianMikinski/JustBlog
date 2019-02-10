import * as toastr from "toastr"

// You must utilize the import before webpack
// removes itRequired for webpack. 
toastr.options.closeButton = true;

/**
 * Factory for showing toastr notifications
 */
export class NotificationFactory {

    // default constructor
    constructor() { }

    public Success(text: string): void {
        toastr.success(text, "Success", this.successOptions);
    }

    public Info(text: string): void {
        toastr.info(text, "Info", this.infoOptions);
    }

    public Warning(text: string): void {
        toastr.warning(text, "Warning", this.warningOptions);
    }

    public Error(text: string): void {
        toastr.error(text, "Error", this.errorOptions);
    }

    private successOptions: ToastrOptions = {
        closeButton: false,
        debug: false,
        newestOnTop: false,
        progressBar: true,
        positionClass: "toast-top-right",
        preventDuplicates: false,
        onclick: undefined,
        showDuration: 600,
        hideDuration: 1000,
        timeOut: 5000,
        extendedTimeOut: 1000,
        showEasing: "swing",
        hideEasing: "linear",
        showMethod: "fadeIn",
        hideMethod: "fadeOut"
    };

    private infoOptions: ToastrOptions = {
        closeButton: false,
        debug: false,
        newestOnTop: false,
        progressBar: true,
        positionClass: "toast-top-right",
        preventDuplicates: false,
        onclick: undefined,
        showDuration: 300,
        hideDuration: 1000,
        timeOut: 5000,
        extendedTimeOut: 1000,
        showEasing: "swing",
        hideEasing: "linear",
        showMethod: "fadeIn",
        hideMethod: "fadeOut"
    };

    private warningOptions: ToastrOptions = {
        closeButton: false,
        debug: false,
        newestOnTop: false,
        progressBar: true,
        positionClass: "toast-top-right",
        preventDuplicates: false,
        onclick: undefined,
        showDuration: 300,
        hideDuration: 1000,
        timeOut: 5000,
        extendedTimeOut: 1000,
        showEasing: "swing",
        hideEasing: "linear",
        showMethod: "fadeIn",
        hideMethod: "fadeOut"
    };

    private errorOptions: ToastrOptions = {
        closeButton: false,
        debug: false,
        newestOnTop: false,
        progressBar: true,
        positionClass: "toast-top-right",
        preventDuplicates: false,
        onclick: undefined,
        showDuration: 600,
        hideDuration: 1000,
        timeOut: 5000,
        extendedTimeOut: 1000,
        showEasing: "swing",
        hideEasing: "linear",
        showMethod: "fadeIn",
        hideMethod: "fadeOut"
    };
}