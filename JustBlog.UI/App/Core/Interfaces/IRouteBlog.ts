﻿export interface IRouteBlog extends ng.route.IRoute {
    action?: string;
    authorizationResolver?: any;
    authorize: boolean;
    resolve?: any;
    resource?: string;
}