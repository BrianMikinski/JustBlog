/**
 * Giving our routeParams types
 */
export interface IBlogRouteParams extends ng.route.IRouteParamsService {
    urlSlug: string;
    postId: number;
    tagUrlSlug: string;
    categoryId: number;
    tagId: number;
}