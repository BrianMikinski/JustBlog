import { AdminController } from "admin/admin.controller";
import { default as adminModule } from "admin/admin.module";
import { AdminService } from "admin/admin.service";
import { AuthService } from "Core/auth.service";
import { default as coreModule } from "Core/core.module";
import { ICoreService } from "Core/core.service";
import { default as notificationModule } from "Notification/notification.module";
import * as angular from "angular";
import 'angular-mocks';

/*
 * Mocking out the Admin Angular controller. Admin controller depends on
 * the notification and core modules, therefore they must be imported
 */
describe(`Module "${adminModule}: Admin Controller Mockup, dependencies to "${notificationModule}", and "${coreModule}"`, function () {

    // arrange

    // mock out module dependencies
    beforeEach(angular.mock.module("app.notification"));
    beforeEach(angular.mock.module("app.core"));
    beforeEach(angular.mock.module("app.admin"));

    // setup controller and promise mocks
    let $rootScope: ng.IRootScopeService;
    let $q: ng.IQService;
    let timeout: ng.ITimeoutService;

    // create the mock blog controller
    let AdminController: AdminController;
    let _coreService: ICoreService;
    let _adminService: AdminService;
    let _authService: AuthService;

    // mock blog controller
    beforeEach(inject(($controller: ng.IControllerService,
        _$rootScope_: ng.IRootScopeService,
        _$q_: ng.IQService,
        coreService: ICoreService,
        adminService: AdminService,
        $timeout: ng.ITimeoutService) => {

        // Arange scopes and promises. We need rootscope to handle resolving promises
        $rootScope = _$rootScope_;
        $q = _$q_;
        timeout = $timeout;

        AdminController = <AdminController>$controller("Admin", {
            coreService: coreService,
            _authService: {},
            _adminService: adminService,
            _notificationService: {},
            _route: {},
            _location: {},
            _sce: {},
            _window: {}
        });
    }));

    //it("Admin Login: Successfull login", () => {
    //    // arrange
    //    let authResponse: number = 200;

    //    let runTest: boolean = false;

    //    if (runTest) {
    //        let adminServiceLogin: ng.IDeferred<number> = $q.defer();
    //        spyOn(_adminService, "Login").and.returnValue(adminServiceLogin.promise);
    //        adminServiceLogin.resolve(authResponse);

    //        AdminController.LoginUser = {
    //            Email: "testEmailAddress@testdomain.com",
    //            Password: "this is a test",
    //            RememberMe: true
    //        }

    //        timeout.flush();
    //        timeout.verifyNoPendingTasks();

    //        // act
    //        AdminController.Login()
    //        $rootScope.$apply();

    //        // assert
    //        expect(true).toBe(true);
    //    }

        // assert
    //    expect(true).toBe(true);

    //});

});