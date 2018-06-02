import App from "app.module";
import Blog from "Blog/blog.module";
import { Post } from "Blog/Post/Post";
import { BlogService } from "Blog/blog.service";
import { ICoreService } from "Core/core.service";
import { HomeComponentController, HomeComponentName } from "Blog/Home/home.component";
import { MetaData } from "Blog/MetaData/MetaData";
import { CoreModule } from "Core/core.module";
import { GridQuery } from "Core/Models/GridQuery";

describe(` ${Blog.Name()}: Home Component Tests - `, function () {

    let $provide: ng.auto.IProvideService;
    let $rootScope: ng.IRootScopeService;
    let $compile: ng.ICompileService;
    let $httpBackend: ng.IHttpBackendService;
    let $componentController: ng.IComponentControllerService;
    let $timeout: ng.ITimeoutService;

    /*
     * All html views are copied over using gulp, then the karma ng-html2js-preprocessor
     * bundles the html views up into an angular module. These settings can be changed from the karma
     * conf.js file
     */
    beforeEach(angular.mock.module("componentTemplates"))

    // mock modules required by component
    beforeEach(angular.mock.module("app.notification"));
    beforeEach(angular.mock.module('ui.router'));

    beforeEach(angular.mock.module("app.core", (_$provide_: ng.auto.IProvideService) => {
        // mock out auth route constants. All jasmine constants must be mocked using the $provide services
        _$provide_.constant("AUTH_ROUTE_CONSTANTS", CoreModule.HttpAuthServiceRoutes());

        // $provide variable can now be used to substitute mocked or spied services
        $provide = _$provide_;
    }));

    beforeEach(angular.mock.module("app.blog"));

    let metaData: MetaData = {
        Author: "Robert Graves",
        AdminEmail: "robertgraves@gmail.com",
        Description: "",
        Domain: "",
        Facebook: "",
        Posts: [],
        Github: "github.com/robertgraves",
        Motto: "I writes the code.",
        Title: "The greatest blog of all time.",
        Twitter: "Roberts Twitter Feed",
        URL: "robertgraves.net",
        XMLFeed: "robertgraves.net/xml",
    };

    beforeEach(inject((_$rootScope_: angular.IRootScopeService,
        _$compile_: angular.ICompileService,
        _$q_: ng.IQService,
        coreService: ICoreService,
        _$httpBackend_: ng.IHttpBackendService,
        _$componentController_: ng.IComponentControllerService,
        _$timeout_: ng.ITimeoutService,
        blogService: BlogService) => {

        // Save copy of angular services
        $rootScope = _$rootScope_;
        $compile = _$compile_;
        $componentController = _$componentController_;
        $httpBackend = _$httpBackend_;
        $timeout = _$timeout_;

        // meta data promise and http backend calls
        let metaDataPromise: ng.IDeferred<MetaData> = _$q_.defer();
        metaDataPromise.resolve(metaData);
        spyOn(coreService, "GetMetaData").and.returnValue(metaDataPromise.promise);

        $provide.value("coreService", coreService);

        $httpBackend.when("GET", "../blog/metadata").respond(metaData);

        // blog service query for retrieving posts
        let retrieveGridQueryPosts: ng.IDeferred<GridQuery<Post>> = _$q_.defer();
        let postsGridData: GridQuery<Post> = PostGridQuery();

        spyOn(blogService, "RetrievePostsGridData").and.returnValue(retrieveGridQueryPosts.promise);
        retrieveGridQueryPosts.resolve(postsGridData);

        $provide.value("blogService", blogService);
    }));

    it("Home component meta data url is correct", function () {

        // if you had scope variables apply them here
        let scope: ng.IRootScopeService = $rootScope.$new();
        let element: JQuery = angular.element("<home></home>") // set your scope variables up in the javascript here
        element = $compile(element)(scope);
        $compile(element)(scope);
        scope.$apply();

        let controller = $componentController(HomeComponentName, { $scope: scope }, {})

        $rootScope.$apply();

        $timeout.flush(); // flush will remove all deferrals that may have been created
        $timeout.verifyNoPendingTasks();

        let urlElement = element.find('h1');
        expect(urlElement.text()).toEqual('robertgraves.net');
    });

    it("Home component posts and titles", function () {

        // arrage
        // if you had scope variables apply them here
        let scope: ng.IRootScopeService = $rootScope.$new();
        let element: JQuery = angular.element("<home></home>") // set your scope variables up in the javascript here
        element = $compile(element)(scope);
        $compile(element)(scope);
        scope.$apply();

        // act
        let controller = $componentController(HomeComponentName, { $scope: scope }, {})

        $rootScope.$apply();

        $timeout.flush(); // flush will remove all deferrals that may have been created
        $timeout.verifyNoPendingTasks();

        // assert
        let postsElements = element.find("article > h2");
        expect(postsElements.length).toEqual(3);

        let postTitles: Array<any> = element.find('article > h2 > a').map(function (){
            return $(this).text()
        }).get();

        expect(postTitles[0]).toEqual("Aligator");
        expect(postTitles[1]).toEqual("Bear");
        expect(postTitles[2]).toEqual("Cat");
    });

    /**
     * Create the data for a post grid query mock
     */
    function PostGridQuery(): GridQuery<Post> {

        let postsGridData: GridQuery<Post> = new GridQuery<Post>();
        postsGridData.PagingProperties.DEFAULT_PAGE_SIZE = 10;
        postsGridData.PagingProperties.Index = 0;
        postsGridData.PagingProperties.PageSize = 10;
        postsGridData.PagingProperties.TotalPages = 1;
        postsGridData.PagingProperties.TotalResults = 3;
        postsGridData.PagingProperties.SortFields = [{ Field: "Title", IsAscending: true }];

        postsGridData.Results = new Array<Post>(
            {
                Title: "Aligator",
                Description: "test",
                Id: 0,
                Modified: new Date(),
                PostedOn: new Date(),
                Published: true,
                ShortDescription: "test",
                Tags: [],
                Slug: "test",
                UrlSlug: "Test",
                Meta: "Test",
                CategoryId: 0,
                Category: {
                    Description: "",
                    Id: 0,
                    Modified: new Date(),
                    Name: "Test",
                    PostCount: 4,
                    Slug: "testCategorySlug"
                }
            },
            {
                Title: "Bear",
                Description: "test",
                Id: 0,
                Modified: new Date(),
                PostedOn: new Date(),
                Published: true,
                ShortDescription: "test",
                Tags: [],
                Slug: "test",
                UrlSlug: "Test",
                Meta: "Test",
                CategoryId: 0,
                Category: {
                    Description: "",
                    Id: 0,
                    Modified: new Date(),
                    Name: "Test",
                    PostCount: 4,
                    Slug: "testCategorySlug"
                }
            },
            {
                Title: "Cat",
                Description: "test",
                Id: 0,
                Modified: new Date(),
                PostedOn: new Date(),
                Published: true,
                ShortDescription: "test",
                Tags: [],
                Slug: "test",
                UrlSlug: "Test",
                Meta: "Test",
                CategoryId: 0,
                Category: {
                    Description: "",
                    Id: 0,
                    Modified: new Date(),
                    Name: "Test",
                    PostCount: 4,
                    Slug: "testCategorySlug"
                }
            }
        );

        return postsGridData;
    }
});