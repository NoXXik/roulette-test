import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {User, UserState} from "../types/types";
import {userApi} from "../../api/userApi";


const initialState: UserState = {
    user: null,
    access_token: null,
}
const userSlice = createSlice({
    name: 'user',
    initialState: initialState,
    reducers: {
        setAccessToken: (state, action: PayloadAction<any>) => {
            state.access_token = action.payload.access_token
            localStorage.setItem('access_token', action.payload.access_token)
        },
        logout: (state) => {
            state.access_token = initialState.access_token
            state.user = initialState.user
        },
        setUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload
        },
        addToBalance: (state, action: PayloadAction<number>) => {
            if (state.user) {
                state.user.balance = state.user.balance + action.payload
            }
        },
        subFromBalance: (state, action: PayloadAction<number>) => {
            if (state.user) {
                state.user.balance = state.user.balance - action.payload
            }
        },
    },
    extraReducers: (builder) => {
        builder.addMatcher(userApi.endpoints.login.matchFulfilled, (state, {payload}) => {
            if (payload.user && payload.access_token) {
                state.access_token = payload.access_token;
                state.user = payload.user;
                localStorage.setItem('access_token', payload.access_token)
            }
        });
        builder.addMatcher(userApi.endpoints.authorization.matchFulfilled, (state, {payload}) => {
            if (payload.user && payload.access_token) {
                state.access_token = payload.access_token;
                state.user = payload.user;
                localStorage.setItem('access_token', payload.access_token)
            }
        });
        builder.addMatcher(userApi.endpoints.logout.matchFulfilled, (state) => {
            state.access_token = initialState.access_token;
            state.user = initialState.user;
            localStorage.removeItem('access_token')
        });
        builder.addMatcher(userApi.endpoints.getUser.matchFulfilled, (state, {payload}) => {
            state.user = payload;
        });
        builder.addMatcher(userApi.endpoints.changeSetting.matchFulfilled, (state, {payload}) => {
            state.user = payload;
        });
    },
})

export const {setAccessToken, logout, setUser, addToBalance, subFromBalance} = userSlice.actions
export default userSlice.reducer

