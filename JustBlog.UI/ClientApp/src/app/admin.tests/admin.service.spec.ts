import { TokenAuthResponse } from "../admin/account/TokenAuthResponse";
import { User } from "../admin/account/User";
import { AdminModule, default as adminModule } from "../admin/admin.module";
import { AdminService } from "../admin/admin.service";
import { AdminRoutes } from "../admin/interfaces/AdminRoutes";
import { LoginModel } from "../admin/login/LoginModel";
import * as angular from 'angular';
import { Metadata } from "../blog/metadata/MetaData";
import { AuthService } from "../core/authorization/auth.service";
import { default as coreModule } from "../core/core.module";
import { default as notificationModule } from "../notification/notification.module";
require('angular-mocks');

describe(`Module "${adminModule}: Blog Controller Mockup, dependencies to "${notificationModule}", and "${coreModule}"`, function () {

    let $q: ng.IQService;
    let $httpBackend: ng.IHttpBackendService;
    let $rootScope: ng.IRootScopeService;
    let $provide: ng.auto.IProvideService;
    let adminService: AdminService;
    let authService: AuthService;
    let AUTH_ROUTE_CONSTANTS: AdminRoutes;

    let metadata: Metadata = {
        AdminEmail: "admin@justblog.com",
        Author: "John Doe",
        Description: "A blog about .Net development",
        Domain: "http://www.justblog.com",
        Facebook: "http://www.facebook.com",
        Github: "http://www.github.com",
        Motto: "Code for Life!",
        Posts: [],
        Title: "Coding Blog",
        Twitter: "http://www.twitter.com",
        URL: "http://www.justblog.com",
        XMLFeed: "http://www.justblog.com/rss"
    }

    // Setup the service mock prior to the modules being mocked up
    let jwtMockToken: string = `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9
                                .eyJBcHBDbGFpbSI6InJlYWR8YWRtaW4iLCJBcHBEYXRhIjoiZ
                                GF0YXxicmlhbi5taWtpbnNraUBnbWFpbC5jb20iLCJpc3MiOiJ
                                odHRwOi8vbG9jYWxob3N0OjU4MDkzIiwiYXVkIjoianVzdEJsb
                                2dVSSIsImV4cCI6MTQ4ODM0NzY0MiwibmJmIjoxNDg4MzQwNDQy
                                fQ.ISKFpV7kRzYabHbvmC6OdKnUPD2CqGMmfDskkmwbwgM`;

    let localAntiForgeryToken: string = ``;

    // mock out module dependencies
    beforeEach(angular.mock.module("app.notification"));
    beforeEach(angular.mock.module("app.core", (_$provide_: ng.auto.IProvideService) => {
        // mock out auth route constants. All jasmine constants must be mocked using the $provide services
        _$provide_.constant("AUTH_ROUTE_CONSTANTS", AdminModule.HttpAdminServiceRoutes());

        $provide = _$provide_;
    }));

    beforeEach(angular.mock.module("app.admin"));

    let serializeQueryStringParamsSpy: jasmine.Spy;

    // mock blog controller
    beforeEach(inject((_$httpBackend_: ng.IHttpBackendService,
        _adminService_: AdminService,
        _authService_: AuthService,
        _AUTH_ROUTE_CONSTANTS_: AdminRoutes) => {

        adminService = _adminService_;
        $httpBackend = _$httpBackend_;
        authService = _authService_;
        AUTH_ROUTE_CONSTANTS = _AUTH_ROUTE_CONSTANTS_;

        // Setup spy of all local tokens
        spyOn(authService, "GetLocalToken")
            .and.returnValue(jwtMockToken);

        // spy on serialize to query string
        serializeQueryStringParamsSpy = spyOn(adminService, "SerializeToQueryStringParams")

        _$httpBackend_.whenPOST("./blog/metadata").respond(metadata);
    }));

    let applicationUsers: Array<User>;


    // setup list of application users
    beforeEach(() => {

        applicationUsers = new Array<User>();

        let userA: User = {
            Birthdate: new Date(1990, 5, 5),
            Email: "johnTestEmail@gmail.com",
            EmailConfirmed: true,
            FirstName: "John",
            LastName: "Doe",
            Id: "0fbab5f8-3225-48a8-906b-64ee9a75a24b",
            PhoneNumber: "7772234",
            PhoneNumberConfirmed: true,
            TwoFactorEnabled: true,
            UserName: "johndoe@gmail.com",
            City: "New York City",
            State: "New York",
            Country: "United States",
            PostalCode: "90210",
            AddressLine1: "",
            AddressLine2: ""
        };

        let userB: User = {
            Birthdate: new Date(1992, 5, 5),
            Email: "janeTestEmail@gmail.com",
            EmailConfirmed: true,
            FirstName: "John",
            LastName: "Doe",
            Id: "1fbab5f8-3225-48a8-906b-64ee9a75a24s",
            PhoneNumber: "7772224",
            PhoneNumberConfirmed: true,
            TwoFactorEnabled: true,
            UserName: "janedoe@gmail.com",
            City: "New York City",
            State: "New York",
            Country: "United States",
            PostalCode: "90210",
            AddressLine1: "",
            AddressLine2: ""
        };

        applicationUsers.push(userA);
        applicationUsers.push(userB);
    });

    // cleanup
    afterEach(() => {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it(`${AdminService}: ReadIdentityUsers()`, () => {

        // arrange
        $httpBackend.whenPOST("/Manage/ReadIdentityUsers").respond(applicationUsers);

        // act
        adminService.readApplicationUsers().then((response) => {

            // assert
            expect(applicationUsers).toEqual(response);
        });

        // clean up
        $httpBackend.flush();
    });

    it(`AdminService: Login()`, () => {

        // arrange
        let login: LoginModel = {
            Email: "testUser@gmail.com",
            Password: "pa$$word",
            RememberMe: true
        }

        let authResponse: TokenAuthResponse = {
            auth_token: jwtMockToken,
            expires_in: 500,
            token_type: "bearer"
        };

        $httpBackend.whenPOST(AUTH_ROUTE_CONSTANTS.Login).respond(jwtMockToken);

        // act
        adminService.login(login).then((response) => {

            let authToken: string = authService.GetLocalToken();

            // assert
            expect(authResponse.auth_token).toEqual(authToken);
            expect(serializeQueryStringParamsSpy).toHaveBeenCalled();

            let jwtSavedToken = authService.GetLocalToken();

            expect(jwtSavedToken).toEqual(jwtMockToken);
        });

        // cleanup
        $httpBackend.flush();
        authService.DestroyUserTokens();
    });
});
