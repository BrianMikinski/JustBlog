import { AuthService } from "Core/auth.service";
import { BaseModule } from "Core/Models/BaseModule";
import { BlogController } from "Blog/blog.controller";
import { BlogService } from "Blog/blog.service";
import { CategoriesGridComponentName, CategoriesGridComponent } from "Blog/Category/categoryGrid.component";
import { CategoryComponentName, CategoryComponent } from "Blog/Category/category.component";
import { CreatePostComponentName, CreatePostComponent } from "Blog/Post/createpost.component";
import { HomeComponentName, HomeComponent } from "Blog/Home/home.component";
import { IActions } from "Core/Interfaces/IActions";
import { IResources } from "Core/Interfaces/IResources";
import { IRouteBlog } from "Core/Interfaces/IRouteBlog";
import { LoginComponentName } from "Admin/Login/login.component";
import { PostComponentName, PostComponent } from "Blog/Post/post.component";
import { PostsGridComponentName, PostsGridComponent } from "Blog/Post/postgrid.component";
import { ProfileComponentName, ProfileComponent } from "Blog/Profile/profile.component";
import { TagsGridComponentName, TagsGridComponent } from "Blog/Tag/tagsGrid.component";

/**
 * Class for setting up the admin module
 */
export class BlogModule extends BaseModule {

    constructor() {
        super();

        this.moduleName = "app.blog";
        this.moduleDependencies = ["ngAnimate", "ui.bootstrap", "ngSanitize", "ui.tinymce", "ui.router"];

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

        let homeState: ng.ui.IState = {
            name: "home",
            component: HomeComponentName,
            url: "/home"
        };

        let defaultState: ng.ui.IState = {
            name: "default",
            component: HomeComponentName,
            url: "/"
        };

        let postState: ng.ui.IState = {
            name: "post",
            component: PostComponentName,
            url: "/post/{urlSlug:string}"
        };

        let categoriesState: ng.ui.IState = {
            name: "categories",
            component: CategoryComponentName,
            url: "/categories"
        };

        let addPostState: ng.ui.IState = {
            name: "addPost",
            component: CreatePostComponentName,
            url: "/post/add"
        }

        let editPostState: ng.ui.IState = {
            name: "editpost",
            component: CreatePostComponentName,
            url: "/post/edit/{postId:string}"
        }

        let aboutMeState: ng.ui.IState = {
            name: "aboutme",
            url: "/aboutme",
            templateUrl: "Blog/AboutMe/aboutme.html"
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
    private routeConfig($routeProvider: ng.route.IRouteProvider, RESOURCES: IResources, ACTIONS: IActions): void {
        try {

            let createPostRoute: IRouteBlog = {
                templateUrl: "blog/post/create.html",
                caseInsensitiveMatch: true,
                controller: BlogController,
                controllerAs: "vm",
                authorize: true,
                action: ACTIONS.Read,
                resource: RESOURCES.Admin,
                authorizationResolver: null
            };

            let editPostRoute: IRouteBlog = {
                templateUrl: "blog/post/create.html",
                caseInsensitiveMatch: true,
                controller: BlogController,
                controllerAs: "vm",
                authorize: true,
                action: ACTIONS.Read,
                resource: RESOURCES.Admin,
                authorizationResolver: null
            };

            let editCategoryRoute: IRouteBlog = {
                templateUrl: "blog/category/create.html",
                caseInsensitiveMatch: true,
                controller: BlogController,
                controllerAs: "vm",
                authorize: true,
                action: ACTIONS.Read,
                resource: RESOURCES.Admin,
                authorizationResolver: null
            };

            let editTagRoute: IRouteBlog = {
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
                    templateUrl: "blog/aboutme.html",
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
                    templateUrl: "blog/post/post.html",
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

export default Blog;

Blog.AddFactory("blogService", blogFactory);

blogFactory.$inject = ["$http", "authService"];
function blogFactory($http: ng.IHttpService, authService: AuthService): BlogService {

    return new BlogService($http, authService);
}

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