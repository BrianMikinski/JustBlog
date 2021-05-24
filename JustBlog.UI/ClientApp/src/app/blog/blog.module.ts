import { default as uirouter } from "@uirouter/angularjs";
import * as angular from "angular";
import * as ngAnimate from "angular-animate";
import * as ngSantize from "angular-sanitize";
import { BaseModule } from "../core/models/BaseModule";
import { BlogController } from "./blog.controller";
import { BlogService, BlogServiceName } from "./blog.service";
import { CategoryComponent, CategoryComponentName } from "./category/category.component";
import { CategoriesGridComponent, CategoriesGridComponentName } from "./category/categoryGrid.component";
import { CreateCategoryComponent, CreateCategoryComponentName } from "./category/createCategory.component";
import { HomeComponent, HomeComponentName } from "./home/home.component";
import { CreatePostComponent, CreatePostComponentName } from "./post/createpost.component";
import { PostComponent, PostComponentName } from "./post/post.component";
import { PostsGridComponent, PostsGridComponentName } from "./post/postgrid.component";
import { ProfileComponent, ProfileComponentName } from "./profile/profile.component";
import { TagsGridComponent, TagsGridComponentName } from "./tag/tagsGrid.component";

/**
 * Angular ui bootstrap and angular tiny mce doesn't have a a default export so we have to require it manually
 */
require("angular-ui-bootstrap");
const angularUIBootstrapModuleName = "ui.bootstrap";

require("angular-ui-tinymce");
const tinyMCEModuleName = "ui.tinymce";

const moduleName = "app.blog";
export default moduleName;

/**
 * Class for setting up the admin module
 */
export class BlogModule extends BaseModule {

  constructor() {
    super();

    this.moduleName = moduleName;
    this.moduleDependencies = [ngAnimate, ngSantize, uirouter, angularUIBootstrapModuleName, tinyMCEModuleName];

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
    };

    const editPostState: ng.ui.IState = {
      name: "editpost",
      component: CreatePostComponentName,
      url: "/post/edit/{postId:string}"
    };

    const aboutMeState: ng.ui.IState = {
      name: "aboutme",
      url: "/aboutme",
      template: require("!raw-loader!./about-me/about-me.html")
    };

    const createCategoryState: ng.ui.IState = {
      name: "createcategory",
      component: CreateCategoryComponentName,
      url: "/createCategory"
    };

    // order matters! Routes will not fall through unless specified
    $stateProvider.state(addPostState);
    $stateProvider.state(editPostState);
    $stateProvider.state(homeState);
    $stateProvider.state(defaultState);
    $stateProvider.state(categoriesState);
    $stateProvider.state(aboutMeState);
    $stateProvider.state(postState);
    $stateProvider.state(createCategoryState);
  }

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
Blog.AddComponent(CreateCategoryComponentName, new CreateCategoryComponent());
