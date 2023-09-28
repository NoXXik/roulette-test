import {rtkApi} from "../../../shared/api/rtkApi";
import {User, UserLocalSignin, UserState} from "../model/types/types";
import {HistoryBet} from "../../../widgets/Roulette/model/types/types";

interface AuthorizationData {
    access_token: string,
    user: User;
}
export const userApi = rtkApi.injectEndpoints({
    endpoints: (build) => ({
        login: build.mutation<UserState, UserLocalSignin>({
            query: (data: UserLocalSignin) => ({
                url: '/auth/local/signin',
                method: 'POST',
                body: data
            })
        }),
        authorization: build.query<AuthorizationData, null>({
            query: () => ({
                url: '/auth/authorization',
                method: 'GET',
            })
        }),
        getUser: build.query<User, null>({
            query: () => ({
                url: '/user/user',
                method: 'GET',
            }),
            providesTags: ['user']
        }),
        logout: build.mutation({
            query: () => ({
                url: '/auth/logout',
                method: 'POST',
            })
        }),
        changeSetting: build.mutation<any, {setting: string, value: boolean | string}>({
            query: (data) => ({
                url: '/user/change/setting',
                method: 'POST',
                body: data
            })
        }),
        getRouletteBets: build.query<HistoryBet[], {limit: number, page: number}>({
            query: (params) => ({
                url: `/roulette/user-bets`,
                method: 'GET',
                params: params
            })
        })
    })
})

export const {useLoginMutation, useLogoutMutation, useLazyGetUserQuery, useLazyAuthorizationQuery, useChangeSettingMutation, useLazyGetRouletteBetsQuery} = userApi
