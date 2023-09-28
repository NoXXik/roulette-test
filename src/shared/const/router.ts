export enum AppRoutes {
    MAIN = 'main',
    LOGIN = 'login',
    HISTORY= 'history',
    AFFILIATE='affiliate',
    PROFILE = 'profile',
    // SETTINGS = 'settings',
    // ABOUT = 'about',
    // PROFILE = 'profile',
    // ADMIN_PANEL = 'admin_panel',
    // FORBIDDEN = 'forbidden',
    // // last
    // NOT_FOUND = 'not_found',
}

export const getRouteMain = () => '/';
export const getRouteLogin = () => '/login';
export const getRouteHistory = () => '/history';
export const getRouteAffiliate = () => '/affiliate';

export const getRouteProfile = () => 'profile';


export const getRouteSettings = () => '/settings';
export const getRouteAbout = () => '/about';
// export const getRouteProfile = (id: string) => `/profile/${id}`;
export const getRouteAdmin = () => '/admin';
export const getRouteForbidden = () => '/forbidden';

export const AppRouteByPathPattern: Record<string, AppRoutes> = {
    [getRouteMain()]: AppRoutes.MAIN,
    [getRouteLogin()]: AppRoutes.LOGIN,
    [getRouteAffiliate()]: AppRoutes.AFFILIATE,
    [getRouteProfile()]: AppRoutes.PROFILE
    // [getRouteSettings()]: AppRoutes.SETTINGS,
    // [getRouteAbout()]: AppRoutes.ABOUT,
    // [getRouteProfile(':id')]: AppRoutes.PROFILE,
    // [getRouteAdmin()]: AppRoutes.ADMIN_PANEL,
    // [getRouteForbidden()]: AppRoutes.FORBIDDEN,
};
