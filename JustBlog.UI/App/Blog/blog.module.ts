import {default as uirouter } from "@uirouter/angularjs";
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
import { BaseModule } from "core/models/BaseModule";
import * as angular from "angular";
import * as ngAnimate from "angular-animate";
import * as ngSantize from "angular-sanitize";
//import * as tinyMCE from "tinymce";

// tiny mce
//import * as tinyMCE from "tinymce";
//import tinymce from 'tinymce/tinymce';

//require.context(
//    'file-loader?name=[path][name].[ext]&context=node_modules/tinymce!tinymce/skins',
//    true,
//    /.*/
//);

//import 'tinymce/themes/oxide';

//import 'tinymce/skins/content/default/content.css';
//import 'tinymce/skins/content/document/content.css';
//import 'tinymce/skins/content/writer/content.css';
//import 'tinymce/skins/ui/oxide-dark/content.css';

// Plugins
//import 'tinymce/plugins/paste/plugin'
//import 'tinymce/plugins/link/plugin'
//import 'tinymce/plugins/autoresize/plugin'

//import 'tinymce/themes/silver';

//import 'tinymce/plugins/advlist';
//import 'tinymce/plugins/autolink';
//import 'tinymce/plugins/link';
//import 'tinymce/plugins/image';
//import 'tinymce/plugins/lists';
//import 'tinymce/plugins/charmap';
//import 'tinymce/plugins/print';
//import 'tinymce/plugins/preview';
//import 'tinymce/plugins/hr';
//import 'tinymce/plugins/anchor';
//import 'tinymce/plugins/pagebreak';
//import 'tinymce/plugins/spellchecker';
//import 'tinymce/plugins/searchreplace';
//import 'tinymce/plugins/wordcount';
//import 'tinymce/plugins/visualblocks';
//import 'tinymce/plugins/visualchars';
//import 'tinymce/plugins/code';
//import 'tinymce/plugins/fullscreen';
//import 'tinymce/plugins/insertdatetime';
//import 'tinymce/plugins/media';
//import 'tinymce/plugins/nonbreaking';
//import 'tinymce/plugins/save';
//import 'tinymce/plugins/table';
//import 'tinymce/plugins/directionality';
//import 'tinymce/plugins/emoticons';
//import 'tinymce/plugins/template';
//import 'tinymce/plugins/paste';
//import 'tinymce/plugins/importcss';

//require('tinymce/skins/ui/oxide/content.min.css');

//import '!style-loader!css-loader!tinymce/skins/ui/oxide/skin.min.css';
//import contentStyle from 'tinymce/skins/ui/oxide/content.min.css';

//exports.TinyMce.getDefaultTinyMceConfig = function (base_path, file_browser_url) {
//    return {
//        selector: 'textarea.tinymce',
//        width: 'auto',
//        height: '300',
//        theme: 'silver',
//        skin: false,
//        // content_style: false,
//        content_style: contentStyle.toString(),
//        ...
//            };
//};

// Initialize
//tinyMCE.init({
//    //selector: '#testTest',
//    //selector: 'textarea.tinymce',
//    //skin: false,
//    plugins: ['paste', 'link', 'autoresize'],
//    theme: 'modern'
//});

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
        this.moduleDependencies = [ngAnimate, ngSantize, uirouter, angularUIBootstrapModuleName, tinyMCEModuleName ];

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