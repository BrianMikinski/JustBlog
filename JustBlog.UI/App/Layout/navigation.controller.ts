import {CoreService} from "Core/core.service";

/**
 * Public class for handling high level navigation and layouts
 */
export class NavigationController {
    currentUser: any;
    metaData: any;
    IsLoggedIn: boolean;

    static $inject = ['coreService', '$route']
    constructor(private coreService: CoreService, private $route: ng.route.IRouteService) {
    }
}
