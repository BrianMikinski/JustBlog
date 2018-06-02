import { BaseController } from "Core/Models/BaseController";
import { ICoreService } from "Core/core.service";
import { MetaData } from "Blog/MetaData/MetaData";
import { AuthService } from "Core/auth.service";

/**
 * Public class to controll all interactions within the application. We will hold root scope objects here
 */
export class ShellController extends BaseController {

    MetaData: MetaData = new MetaData();
    IsAdmin: boolean;

    static inject = ['coreService', '$route', '$location', '$rootScope', 'authService',"$sce"];
    constructor(private coreService: ICoreService,
        private $route: ng.route.IRouteService,
        private $location: ng.ILocationService,
        private $rootScope: ng.IRootScopeService,
        private authService: AuthService,
        public $sce: ng.ISCEService) {
        super($sce);

        $route.reload();

        let onMetaDataReturned: (data: any) => void;

        onMetaDataReturned = (data: any) => {
            this.MetaData = data;
        };

        coreService.GetMetaData().then(onMetaDataReturned, this.OnErrorCallback);

        $rootScope.$on('unauthorized', function () {
            this.authService.DestroyUserToken();
        });

        // handle forbidden events
        $rootScope.$on('forbidden', function () {
            $location.path("/forbidden");
        });

        // handle event to check if user is an admin
        $rootScope.$on('isAdmin', function () {
            //authService.
        });

        // handle logout event
        $rootScope.$on('logOut', function () {

        });

        // handle login event
        $rootScope.$on('logIn', function () {

        });

        // handle requested meta data
        $rootScope.$on('metaDataRequested', function () {

        });
    }
}