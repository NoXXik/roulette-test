import { fetchBaseQuery } from '@reduxjs/toolkit/query'
import type {
    BaseQueryFn,
    FetchArgs,
    FetchBaseQueryError,
} from '@reduxjs/toolkit/query'
// import { tokenReceived, loggedOut } from './authSlice'
import { Mutex } from 'async-mutex'
import {logout, setAccessToken, setUser} from "../../entities/User/model/slices/userSlice";
// import axios from "axios";
import {User} from "../../entities/User/model/types/types";

// create a new mutex
const mutex = new Mutex()
const baseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_SERVICE_API_URL,
    credentials: 'include',
    prepareHeaders: (headers) => {
        const token = localStorage.getItem('access_token') || '';
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
    },
})
export const baseQueryWithReauth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    // wait until the mutex is available without locking it
    await mutex.waitForUnlock()
    let result = await baseQuery(args, api, extraOptions)
    if (result.error && result.error.status === 401) {
        // checking whether the mutex is locked
        if (!mutex.isLocked()) {
            const release = await mutex.acquire()
            try {
                const refreshResult = await baseQuery(
                    'auth/refresh',
                    api,
                    extraOptions,
                )
                // axios.get(`${import.meta.env.VITE_SERVICE_API_URL}auth/refresh`, { withCredentials: true })
                //     .then(async (response) => {
                //         // Обработка успешного ответа
                //         console.log('Refresh', response.data)
                //         api.dispatch(setAccessToken(response.data))
                //
                //         // retry the initial query
                //         const {data}: {user: User} = await baseQuery(args, api, extraOptions)
                //         console.log(args, api, extraOptions)
                //         console.log(result.data)
                //         if(args.url && args.url === 'auth/authorization') {
                //             api.dispatch(setUser(data.user as User))
                //         }
                //
                //     })
                //     .catch(async (error) => {
                //         // Обработка ошибки
                //         console.log('Logout', error)
                //         await baseQuery(
                //             'auth/logout',
                //             api,
                //             extraOptions
                //         )
                //         api.dispatch(logout)
                //     });
                if (refreshResult.data) {
                    // api.dispatch(tokenReceived(refreshResult.data))
                    // console.log('Refresh', response.data)
                    api.dispatch(setAccessToken(refreshResult.data))
                    const authResult = await baseQuery(
                        'auth/authorization',
                        api,
                        extraOptions,
                    ) as { data: {user: User, access_token: string}}
                    if(authResult.data) {
                        console.log('authresult',authResult.data)
                        api.dispatch(setUser(authResult.data?.user))
                        console.log('authresult',authResult.data)
                        api.dispatch(setAccessToken(authResult.data))
                    }

                    // retry the initial query
                    // const {data}: {user: User} = await baseQuery(args, api, extraOptions)
                    // console.log(args, api, extraOptions)
                    // console.log(result.data)
                    // if(args.url && args.url === 'auth/authorization') {
                    //     api.dispatch(setUser(data.user as User))
                    // }
                } else {
                    api.dispatch(logout())

                }
            } finally {
                // release must be called once the mutex should be released again.
                release()
            }
        } else {
            // wait until the mutex is available without locking it
            await mutex.waitForUnlock()
            console.log(args, api, extraOptions)
            result = await baseQuery(args, api, extraOptions)
            console.log(result.data)
        }
    }
    return result
}
