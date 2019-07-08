import * as uirouter from "@uirouter/angularjs";
import { CategoryComponent, CategoryComponentName } from "blog/category/category.component";
import { CategoriesGridComponent, CategoriesGridComponentName } from "blog/category/categoryGrid.component";
import { HomeComponent, HomeComponentName } from "blog/home/home.component";
import { CreatePostComponent, CreatePostComponentName } from "blog/post/createpost.component";
import { PostComponent, PostComponentName } from "blog/post/post.component";
import { PostsGridComponent, PostsGridComponentName } from "blog/post/postgrid.component";
import { ProfileComponent, ProfileComponentName } from "blog/profile/profile.component";
import { TagsGridComponent, TagsGridComponentName } from "blog/tag/tagsGrid.component";
import { BlogController } from "blog/blog.controller";
import { BlogService, BlogServiceName } from "blog/blog.service";
import { IAction } from "core/authorization/IAction";
import { IResource } from "core/authorization/IResource";
import { IBlogRoute } from "core/authorization/IBlogRoute";
import { BaseModule } from "core/models/BaseModule";
import * as angular from "angular";
import * as ngAnimate from "angular-animate";
import * as ngSantize from "angular-sanitize";
import * as tinyMCE from "tinymce";

/**
 * Angular ui bootstrap and angular tiny mce doesn't have a a default export so we have to require it manually
 */ 
require("angular-ui-bootstrap");
const angularUIBootstrapModuleName: string = "ui.bootstrap";

require("angular-ui-tinymce");
const tinyMCEModuleName: string = "ui.tinymce";

const moduleName: string = "app.blog";
export default moduleName;

/**
 * Class for setting up the admin module
 */
export class BlogModule extends BaseModule {

    constructor() {
        super();

        this.moduleName = moduleName;
        this.moduleDependencies = [ngAnimate, ngSantize, uirouter.default, angularUIBootstrapModuleName, tinyMCEModuleName ];

        this.app = angular.module(this.moduleName, this.moduleDependencies);
        this.app.config(this.uiStateConfig);
        this.app.config(this.locationProviderConfig);
    }

    /**
     * Configure routes based on UI router
     * @param $stateProvider
     * @param $urlRouterProvider
     */
    private uiStateConfig($stateProvider: ng.ui.IStateProvider, $urlRouterProvider: ng.ui.IUrlRouterProvider): void {

        const homeState: ng.ui.IState = {
            name: "home",
            component: HomeComponentName,
            url: "/home"
        };

        const defaultState: ng.ui.IState = {
            name: "default",
            component: HomeComponentName,
            url: "/"
        };

        const postState: ng.ui.IState = {
            name: "post",
            component: PostComponentName,
            url: "/post/{urlSlug:string}"
        };

        const categoriesState: ng.ui.IState = {
            name: "categories",
            component: CategoryComponentName,
            url: "/categories"
        };

        const addPostState: ng.ui.IState = {
            name: "newpost",
            component: CreatePostComponentName,
            url: "/post/new"
        }

        const editPostState: ng.ui.IState = {
            name: "editpost",
            component: CreatePostComponentName,
            url: "/post/edit/{postId:string}"
        }

        const aboutMeState: ng.ui.IState = {
            name: "aboutme",
            url: "/aboutme",
            templateUrl: require("blog/aboutme/aboutme.html")
        }

        // order matters! Routes will not fall through unless specified
        $stateProvider.state(addPostState);
        $stateProvider.state(editPostState);
        $stateProvider.state(homeState);
        $stateProvider.state(defaultState);
        $stateProvider.state(categoriesState);
        $stateProvider.state(aboutMeState);
        $stateProvider.state(postState);
    }

    /**
     * Configure all routes for this model
     * @param $routeProvider
     */
    private routeConfig($routeProvider: ng.route.IRouteProvider, RESOURCES: IResource, ACTIONS: IAction): void {
        try {

            let createPostRoute: IBlogRoute = {
                templateUrl: "blog/post/create.html",
                caseInsensitiveMatch: true,
                controller: BlogController,
                controllerAs: "vm",
                authorize: true,
                action: ACTIONS.Read,
                resource: RESOURCES.Admin,
                authorizationResolver: null
            };

            let editPostRoute: IBlogRoute = {
                templateUrl: "blog/post/create.html",
                caseInsensitiveMatch: true,
                controller: BlogController,
                controllerAs: "vm",
                authorize: true,
                action: ACTIONS.Read,
                resource: RESOURCES.Admin,
                authorizationResolver: null
            };

            let editCategoryRoute: IBlogRoute = {
                templateUrl: "blog/category/create.html",
                caseInsensitiveMatch: true,
                controller: BlogController,
                controllerAs: "vm",
                authorize: true,
                action: ACTIONS.Read,
                resource: RESOURCES.Admin,
                authorizationResolver: null
            };

            let editTagRoute: IBlogRoute = {
                templateUrl: "blog/tag/create.html",
                caseInsensitiveMatch: true,
                controller: BlogController,
                controllerAs: "vm",
                authorize: true,
                action: ACTIONS.Read,
                resource: RESOURCES.Admin,
                authorizationResolver: null
            };

            $routeProvider
                .when("/aboutme", {
                    templateUrl: "blog/aboutme/aboutme.html",
                    caseInsensitiveMatch: true,
                    controller: BlogController,
                    controllerAs: "vm"
                })
                // category Routes
                .when("/categories", {
                    templateUrl: "blog/category/categories.html",
                    caseInsensitiveMatch: true,
                    controller: BlogController,
                    controllerAs: "vm"
                })
                .when("/category/add", editCategoryRoute)
                .when("/category/edit/:categoryId", editCategoryRoute)
                .when("/category/:categoryUrl", {
                    templateUrl: "blog/category/category.html",
                    caseInsensitiveMatch: true,
                    controller: BlogController,
                    controllerAs: "vm"
                })

                // post Routes
                .when("/post/create/:postId", createPostRoute)
                .when("/post/edit/:postId", editPostRoute)
                .when("/post/retrieve/:postId", {
                    templateUrl: require("blog/post/post.html"),
                    caseInsensitiveMatch: true,
                    controller: BlogController,
                    controllerAs: "vm"
                })

                // tag Routes
                .when("/tag/add", editTagRoute)
                .when("/tag/edit/:tagId", editTagRoute)
                .when("/tag/:tagUrlSlug", {
                    templateUrl: "blog/tag/tag.html",
                    caseInsensitiveMatch: true,
                    controller: BlogController,
                    controllerAs: "vm"
                })

                .when("/404/", {
                    templateUrl: "core/errorpages/httpError.html",
                    caseInsensitiveMatch: true
                })
        } catch (error) {
            console.log(error.message);
        }
    };

    /**
     * Configure the location provider to be in html5 mode
     * @param $locationProvider
     */
    private locationProviderConfig($locationProvider: ng.ILocationProvider): void {
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: true
        });

        $locationProvider.hashPrefix()
    };
}

// export container for blog module. Used or initializing the module and
// adding to an angular mock. This is necessary to use required
let Blog: BlogModule = new BlogModule();

Blog.AddService(BlogServiceName, BlogService);

Blog.AddController("Blog", BlogController as ng.Injectable<angular.IControllerConstructor>);

// Add components
Blog.AddComponent(ProfileComponentName, new ProfileComponent());
Blog.AddComponent(HomeComponentName, new HomeComponent());
Blog.AddComponent(PostComponentName, new PostComponent());
Blog.AddComponent(CategoryComponentName, new CategoryComponent());
Blog.AddComponent(PostsGridComponentName, new PostsGridComponent());
Blog.AddComponent(CategoriesGridComponentName, new CategoriesGridComponent());
Blog.AddComponent(TagsGridComponentName, new TagsGridComponent());
Blog.AddComponent(CreatePostComponentName, new CreatePostComponent());