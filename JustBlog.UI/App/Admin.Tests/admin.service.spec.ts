import { AdminService } from "Admin/admin.service";
import { AuthService } from "Core/auth.service";
import { IAuthenticationConstants } from "Core/Interfaces/IAuthenticationConstants";
import { ICoreService, CoreService } from "Core/core.service";
import { ITokenAuthResponse } from "Admin/Account/ITokenAuthResponse";
import { IUser } from "Admin/Account/IUser";
import { LoginModel } from "Admin/Login/LoginModel";
import { MetaData } from "Blog/MetaData/MetaData";
import Admin, { AdminModule } from "Admin/admin.module";
import App from "app.module";
import Core, { CoreModule } from "Core/core.module";
import Notification from "Notification/notification.module";
import { IHttpAdminRoutes } from "Admin/Interfaces/IHttpAdminRoutes";

describe(`Module "${Admin.Name()}: Blog Controller Mockup, dependencies to "${Notification.Name()}", and "${Core.Name()}"`, function () {

    let $q: ng.IQService;
    let $httpBackend: ng.IHttpBackendService;
    let $rootScope: ng.IRootScopeService;
    let $provide: ng.auto.IProvideService;
    let adminService: AdminService;
    let authService: AuthService;
    let AUTH_ROUTE_CONSTANTS: IHttpAdminRoutes;

    let metadata: MetaData = {
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
        _AUTH_ROUTE_CONSTANTS_: IHttpAdminRoutes) => {

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

    let applicationUsers: Array<IUser>;


    // setup list of application users
    beforeEach(() => {

        applicationUsers = new Array<IUser>();

        let userA: IUser = {
            AccessFailedCount: 0,
            BirthDate: new Date(1990, 5, 5),
            Email: "johnTestEmail@gmail.com",
            EmailConfirmed: true,
            FirstName: "John",
            LastName: "Doe",
            Hometown: "Kansas City",
            Id: "0fbab5f8-3225-48a8-906b-64ee9a75a24b",
            LockoutEnabled: false,
            LockoutEndDateUtc: new Date(),
            PhoneNumber: "7772234",
            PhoneNumberConfirmed: true,
            TwoFactorEnabled: true,
            UserName: "johndoe@gmail.com"
        };

        let userB: IUser = {
            AccessFailedCount: 0,
            BirthDate: new Date(1992, 5, 5),
            Email: "janeTestEmail@gmail.com",
            EmailConfirmed: true,
            FirstName: "John",
            LastName: "Doe",
            Hometown: "Houston",
            Id: "1fbab5f8-3225-48a8-906b-64ee9a75a24s",
            LockoutEnabled: false,
            LockoutEndDateUtc: new Date(),
            PhoneNumber: "7772224",
            PhoneNumberConfirmed: true,
            TwoFactorEnabled: true,
            UserName: "janedoe@gmail.com"
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
        adminService.ReadApplicationUsers().then((response) => {

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

        let authResponse: ITokenAuthResponse = {
            auth_token: jwtMockToken,
            expires_in: 500,
            token_type: "bearer"
        };

        $httpBackend.whenPOST(AUTH_ROUTE_CONSTANTS.Login).respond(jwtMockToken);

        // act
        adminService.Login(login).then((response) => {

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