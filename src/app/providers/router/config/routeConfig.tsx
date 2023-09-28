import { MainPage } from '../../../../pages/MainPage';

import {
    AppRoutes, getRouteAffiliate, getRouteHistory, getRouteLogin, getRouteMain, getRouteProfile,
} from '../../../../shared/const/router';
import { AppRoutesProps } from '../../../../shared/types/router';
import {LoginPage} from "../../../../pages/LoginPage";
import {HistoryPage} from "../../../../pages/HistoryPage";
import {AffiliatePage} from "../../../../pages/AffilatePage";
import {ProfilePage} from "../../../../pages/ProfilePage";

export const routeConfig: Record<AppRoutes, AppRoutesProps> = {
    [AppRoutes.MAIN]: {
        path: getRouteMain(),
        element: <MainPage />,
    },
    [AppRoutes.LOGIN]: {
        path: getRouteLogin(),
        element: <LoginPage />,
    },
    [AppRoutes.HISTORY]: {
        path: getRouteHistory(),
        element: <HistoryPage />,
        authOnly: true
    },
    [AppRoutes.AFFILIATE]: {
        path: getRouteAffiliate(),
        element: <AffiliatePage />,
        authOnly: true
    },
    [AppRoutes.PROFILE]: {
        path: getRouteProfile(),
        element: <ProfilePage />,
        authOnly: true
    }
    // [AppRoutes.PROFILE]: {
    //     path: getRouteProfile(':id'),
    //     element: <ProfilePage />,
    //     authOnly: true,
    // },
    // [AppRoutes.ADMIN_PANEL]: {
    //     path: getRouteAdmin(),
    //     element: <AdminPanelPage />,
    //     authOnly: true,
    //     roles: [UserRole.MANAGER, UserRole.ADMIN],
    // },

    // last
    // [AppRoutes.NOT_FOUND]: {
    //     path: '*',
    //     element: <NotFoundPage />,
    // },
};
