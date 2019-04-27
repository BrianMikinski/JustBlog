import { default as adminModule } from "admin/admin.module";
import { CoreModule } from "Core/core.module";
import { RegistrationUser } from "admin/register/RegistrationUser";
import { AdminService } from "admin/admin.service";
import { RegistrationAttempt } from "admin/register/RegistrationAttempt";
import { RegisterUserComponentName, RegisterUserController, RegisterUserComponent } from "admin/register/registerUser.component";
import { ITokenAuthResponse } from "admin/account/ITokenAuthResponse";
import { IHttpHeadersGetter } from "angular";
import * as angular from "angular";
import 'angular-mocks';

describe(` ${adminModule}: Register New User Component Tests - `, function () {

    // angular service mocks
    let $provide: ng.auto.IProvideService;
    let $rootScope: ng.IRootScopeService;
    let $compile: ng.ICompileService;
    let $httpBackend: ng.IHttpBackendService;
    let $componentController: ng.IComponentControllerService;
    let $timeout: ng.ITimeoutService;
    let $q: ng.IQService;

    // custom service mocks
    let adminService: AdminService;

    // commonly used objects
    let birthDate: Date = new Date(1990, 2, 1);

    let newUser: RegistrationUser = {
        BirthDate: birthDate,
        ConfirmPassword: "password",
        Email: "joe.smith@smith.com",
        EmailConfirmed: false,
        FirstName: "Joe",
        LastName: "Smith",
        HomeTown: "Coffeyville",
        ID: "234123432",
        Password: "password",
        PhoneNumber: "234234",
        PhoneNumberConfirmed: true,
        TwoFactorEnabled: false,
        UseName: "joe.smith@smith.com"
    };

    let registrationAttempt: RegistrationAttempt;

    /*
     * All html views are copied over using gulp, then the karma ng-html2js-preprocessor
     * bundles the html views up into an angular module. These settings can be changed from the karma
     * conf.js file
     */
    beforeEach(angular.mock.module("componentTemplates"))
    beforeEach(angular.mock.module("app.notification"));
    beforeEach(angular.mock.module('ui.router'));
    beforeEach(angular.mock.module("app.core", (_$provide_: ng.auto.IProvideService) => {
        // mock out auth route constants. All jasmine constants must be mocked using the $provide services
        _$provide_.constant("AUTH_ROUTE_CONSTANTS", CoreModule.HttpAuthServiceRoutes());

        $provide = _$provide_;
    }));

    beforeEach(angular.mock.module("app.admin"));

    beforeEach(inject((_$rootScope_: angular.IRootScopeService,
        _$compile_: angular.ICompileService,
        _$q_: ng.IQService,
        _adminService_: AdminService,
        _$httpBackend_: ng.IHttpBackendService,
        _$componentController_: ng.IComponentControllerService,
        _$timeout_: ng.ITimeoutService) => {

        $rootScope = _$rootScope_;
        $compile = _$compile_;
        $componentController = _$componentController_;
        $httpBackend = _$httpBackend_;
        $timeout = _$timeout_;
        $q = _$q_;
        adminService = _adminService_;
        
        newUser.BirthDate = birthDate;
    }));

    afterAll(function () {
        registrationAttempt = null;

        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it("Register new user success", function () {

        // arrange
        // mock register new user
        registrationAttempt = {
            Errors: [],
            Succeeded: true,
            User: {
                Email: newUser.Email,
                FirstName: newUser.FirstName,
                LastName: newUser.LastName,
                UseName: newUser.UseName
            }
        };
        
        let registerNewUserDeferred: ng.IDeferred<RegistrationAttempt> = $q.defer();
        registerNewUserDeferred.resolve(registrationAttempt);
        let registerUserSpy: jasmine.Spy = spyOn(adminService, "registerUser").and.returnValue(registerNewUserDeferred.promise);

        // mock user login
        let tokenResponse: ITokenAuthResponse = {
            auth_token: "token_response_asdfasdf",
            expires_in: 1234,
            token_type: "jwt_token"
        }

        let statusHeaders: IHttpHeadersGetter = null;

        let loginResponse: ng.IHttpPromiseCallbackArg<ITokenAuthResponse> = {
            data: tokenResponse,
            status: 200,
            headers: statusHeaders,
            config: null,
            statusText: "",
            xhrStatus: "complete"
        }

        let loginUserDeferred: ng.IDeferred<ng.IHttpPromiseCallbackArg<ITokenAuthResponse> > = $q.defer();
        loginUserDeferred.resolve(loginResponse);

        let loginSpy: jasmine.Spy = spyOn(adminService, "login").and.returnValue(loginUserDeferred.promise);

        $provide.value("adminService", adminService);

        let scope: ng.IRootScopeService = $rootScope.$new();
        let element: JQuery = angular.element(`<${RegisterUserComponentName}></${RegisterUserComponentName}>`)
        element = $compile(element)(scope);
        $compile(element)(scope);
        scope.$apply();

        // we must mock out a response because the component navigates to a different component 
        $httpBackend.expectGET("admin/manageContent.html").respond("Mock response");

        // act
        let registerUserController: RegisterUserController = <RegisterUserController>$componentController(RegisterUserComponentName, { $scope: scope }, {})

        registerUserController.NewUser = newUser;
        registerUserController.Register();

        // apply root scope here so we resolve promises
        $rootScope.$apply();
        $timeout.flush(); // flush will remove all deferrals that may have been created
        $timeout.verifyNoPendingTasks();

        // assert
        expect(newUser.Email).toEqual(registerUserController.CurrentUser.Email);
        expect(newUser.FirstName).toEqual(registerUserController.CurrentUser.FirstName);
        expect(newUser.LastName).toEqual(registerUserController.CurrentUser.LastName);
        expect(newUser.UseName).toEqual(registerUserController.CurrentUser.UseName);
        expect(loginSpy).toHaveBeenCalledTimes(1);
        expect(registerUserSpy).toHaveBeenCalledTimes(1);
    });

    it("Register user fail", function () {

        // arrange
        registrationAttempt = {
            Errors: [{
                    Code: "Invalid  Password",
                    Description: "Password was not valid. Please enter a password..."
            }],
            Succeeded: false,
            User: null
        };

        let registerNewUserPromise: ng.IDeferred<RegistrationAttempt> = $q.defer();
        registerNewUserPromise.resolve(registrationAttempt);
        let registeredUserSpy:jasmine.Spy =  spyOn(adminService, "registerUser").and.returnValue(registerNewUserPromise.promise);

        $provide.value("adminService", adminService);

        // configure DOM elements 
        let scope: ng.IRootScopeService = $rootScope.$new();
        let element: JQuery = angular.element(`<${RegisterUserComponentName}></${RegisterUserComponentName}>`)
        element = $compile(element)(scope);
        $compile(element)(scope);
        scope.$apply();

        // act
        let registerUserController: RegisterUserController = <RegisterUserController>$componentController(RegisterUserComponentName, { $scope: scope }, {})
        registerUserController.NewUser = newUser;

        registerUserController.Register();
       
        $rootScope.$apply();
        $timeout.flush(); 
        $timeout.verifyNoPendingTasks();

        // assert
        expect(registerUserController.CurrentUser.FirstName).toBeUndefined();
        expect(registerUserController.CurrentUser.FirstName).toBeUndefined();
        expect(registerUserController.CurrentUser.LastName).toBeUndefined();
        expect(registerUserController.CurrentUser.UseName).toBeUndefined();
        expect(registeredUserSpy).toHaveBeenCalledTimes(1);
    });
});