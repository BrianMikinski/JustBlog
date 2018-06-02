
// interface for authentcated states
export interface BlogState extends ng.ui.IState {
    action?: string | undefined;

    /**
     * If no authorization resolve is set, then the default auth resolve
     * will be added in the core.module. This can be overrideen by
     * setting a resolve on the route if need be. 
     */
    authorizationResolver?: any | undefined;
    authorize: boolean | undefined;
    resource?: string | undefined;
}