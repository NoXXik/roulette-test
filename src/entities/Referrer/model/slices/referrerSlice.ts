import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {ReferrerState} from "../types/types";
import {referrerApi} from "../../api/referrerApi";



const initialState: ReferrerState = {
    referrer: null
}
const referrerSlice = createSlice({
    name: 'referrer',
    initialState: initialState,
    reducers: {
        changeCodeAction: (state, action: PayloadAction<string>) => {
            if(state.referrer){
                state.referrer.code = action.payload
            }
        }
    },
    extraReducers: (builder) => {
        builder.addMatcher(referrerApi.endpoints.getReferrer.matchFulfilled, (state, {payload}) => {
            if (payload) {
                state.referrer = payload
            }
        });
        builder.addMatcher(referrerApi.endpoints.createReferrer.matchFulfilled, (state, {payload}) => {
            if (payload) {
                state.referrer = payload
            }
        });
        // builder.addMatcher(referrerApi.endpoints.changeCode.matchFulfilled, (state, {payload}) => {
        //     if (payload) {
        //         state.referrer = payload
        //     }
        // });

    },
})

export const {changeCodeAction} = referrerSlice.actions
export default referrerSlice.reducer

