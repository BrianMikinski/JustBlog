import { Category } from "blog/category/Category";
import { MetaData } from "blog/metadata/MetaData";
import { Post } from "blog/Post/Post";
import { Tag } from "blog/tag/Tag";
import { BlogController } from "blog/blog.controller";
import { default as blogModule } from "blog/blog.module";
import { BlogService } from "blog/blog.service";
import { GridQuery } from "core/grid/GridQuery";
import {default as coreModule, CoreModule } from "core/core.module"; // required by blog controller which is a part of the blog.module
import { CoreService } from "core/core.service";
import {default as notificationModule } from "notification/notification.module"; // required by blog controller which is a part of the blog.module
import * as angular from "angular";

/*
 * Mocking out the Blog Angular controller. Blog controller depends on
 * the notification and core modules, therefore they must be imported
 */
describe(`Module "${blogModule}: Blog Controller Mockup, dependencies to "${notificationModule}", "${blogModule}" and "${coreModule}"`, function () {

    // arrange

    // mock out module dependencies
    beforeEach(angular.mock.module("app.notification"));
    beforeEach(angular.mock.module('ui.router'));

    beforeEach(angular.mock.module("app.blog"));

    // setup controller and promise mocks
    let $rootScope: ng.IRootScopeService;
    let $q: ng.IQService;
    let $timeout: ng.ITimeoutService;

    // create the mock blog controller
    let BlogController: BlogController;
    let RetrievePost: Post = new Post();
    let _blogService: BlogService;
    let _coreService: CoreService;

    // mock blog controller
    beforeEach(inject(($controller: ng.IControllerService,
        _$rootScope_: ng.IRootScopeService,
        _$q_: ng.IQService,
        coreService: CoreService,
        blogService: BlogService,
        _$timeout_: ng.ITimeoutService) => {

        // Arange scopes and promises. We need rootscope to handle resolving promises
        $rootScope = _$rootScope_;
        $q = _$q_;
        $timeout = _$timeout_;


        // save off injected services for jasmine Spy's
        _blogService = blogService;
        _coreService = coreService;

        /*
         * Jasmine can be thought of as the equivalent of Moq in C#. There are two main methods of mocking method and service
         * calls -
         *
         * 1. spyOn(service/class, "methodName).and.return/....
         * 2. jasmine.CreateSpy("service/class")
         *
         * 1. Allows you to check for parameters and other method calls
         * 2. Allows you to replace the entire class or serviced
         * 
         * Jasmine spy on the coreService.GetMetaData() method that is called in the constructor of the blog controller.
         * Using spys we can see when dependency methods are called and act on them. This method is called in the constructor
         * of the BlogController. Poorly designed but at least we can test it.
         */
        let metaDataPromise: ng.IDeferred<MetaData>;
        metaDataPromise = _$q_.defer();
        spyOn(coreService, "GetMetaData").and.returnValue(metaDataPromise.promise); // Allows method to be called but changes the return value
        let mockService = jasmine.createSpy('blogService'); //Creates a fake and circumvents the original calling of the method

        BlogController = <BlogController>$controller("blog", {
            coreService: coreService,
            _blogService: blogService,
            _route: {}, // Set these to null if we don't care about testing them
            _routeParams: {},
            _location: {},
            _sce: {},
            _window: {},
            _notificationService: {},
            _authService: {}
        });
    }));

    // reconfigure RetrievePost for every test
    beforeEach(() => {
        RetrievePost.Category = new Category();
        RetrievePost.Id = 500;
        RetrievePost.Description = "Test Post Description";
        RetrievePost.Title = "My very first test post!";
    })

    xit("blog Controller: Retrieve Post Test", () => {
        // arrange
        let retrievePostByIdPromise: ng.IDeferred<Post> = $q.defer();
        spyOn(_blogService, "RetrievePost").and.returnValue(retrievePostByIdPromise.promise);
        retrievePostByIdPromise.resolve(RetrievePost);

        // act
        BlogController.RetrievePost(RetrievePost.Id);

        // must call to apply the changes to your promise and resolve
        $rootScope.$apply();

        // assert
        //expect(BlogController.Post.Id).toBe(500);
        //expect(BlogController.Post.Description).toBe("Test Post Description");
        //expect(BlogController.Post.Title).toBe("My very first test post!");
    });

    xit("blog Controller: PostPageAndSort Test", () => {

        // arrange
        let retrieveGridQueryPosts: ng.IDeferred<GridQuery<Post>> = $q.defer();

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

        spyOn(_blogService, "RetrievePostsGridData").and.returnValue(retrieveGridQueryPosts.promise);
        retrieveGridQueryPosts.resolve(postsGridData);

        // Clear an outstanding promises, that likely come from our BlogController constructor.
        // This indicates we have a poorly architected constructor
        $timeout.flush(); // flush will remove all deferrals that may have been created
        $timeout.verifyNoPendingTasks();

        // act
        //BlogController.PostsPageAndSort(0, "Title", true);

        $rootScope.$apply();

        // assert
        //if (BlogController.Posts.Results.length > 0) {
        //    expect(BlogController.Posts.Results[0].Title).toEqual("Aligator");
        //} else {
        //    fail("Test Failed: Grid Posts were found to be empty.");
        //}
    });

    xit("blog Controller: TagsPageAndSort Test", () => {

        // arrange
        let retrieveGridQueryTagsPromise: ng.IDeferred<GridQuery<Tag>> = $q.defer();

        let tagsGridData: GridQuery<Tag> = new GridQuery<Tag>();
        tagsGridData.PagingProperties.DEFAULT_PAGE_SIZE = 10;
        tagsGridData.PagingProperties.Index = 0;
        tagsGridData.PagingProperties.PageSize = 10;
        tagsGridData.PagingProperties.TotalPages = 1;
        tagsGridData.PagingProperties.TotalResults = 3;
        tagsGridData.PagingProperties.SortFields = [{ Field: "Name", IsAscending: true }];

        tagsGridData.Results = new Array<Tag>(
            {
                Description: "Aligator",
                Id: 1,
                Modified: new Date(),
                Name: "Ali",
                UrlSlug: "AligatorURL"
            }, {
                Description: "Bear",
                Id: 1,
                Modified: new Date(),
                Name: "Bearr",
                UrlSlug: "BearURL"
            },
            {
                Description: "Cat",
                Id: 1,
                Modified: new Date(),
                Name: "Catty",
                UrlSlug: "CatURL"
            }
        );

        spyOn(_blogService, "RetrieveTagsGridData").and.returnValue(retrieveGridQueryTagsPromise.promise);
        retrieveGridQueryTagsPromise.resolve(tagsGridData);

        $timeout.flush();
        $timeout.verifyNoPendingTasks();

        // act
        //BlogController.TagsPageAndSort(0, "Name");
        //$rootScope.$apply();

        //// assert
        //if (BlogController.Tags.Results.length > 0) {
        //    expect(BlogController.Tags.Results[0].Description).toEqual("Aligator");
        //} else {
        //    fail("Test Failed: Grid Posts were found to be empty.");
        //}
    });
});