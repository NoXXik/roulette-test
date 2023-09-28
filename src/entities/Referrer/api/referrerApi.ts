import {rtkApi} from "../../../shared/api/rtkApi";
import {Referrer} from "../model/types/types";

export const referrerApi = rtkApi.injectEndpoints({
    endpoints: (build) => ({
        getReferrer: build.query<Referrer | null, null>({
            query: () => ({
                url: '/referrer/get-by-id',
                method: 'GET',
            }),
            providesTags: ['referrer']
        }),
        createReferrer: build.mutation<Referrer | null, {code: string}>({
            query: (data) => ({
                url: '/referrer/create',
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['referrer']
        }),
        changeCode: build.mutation<Referrer | null, {code: string}>({
            query: (data) => ({
                url: '/referrer/change-code',
                method: 'POST',
                body: data
            })
        }),
        collectBonuses: build.mutation<Referrer, null>({
            query: () => ({
                url: '/referrer/collect',
                method: 'POST'
            }),
            invalidatesTags: ['user', 'referrer' ]
        })
    })
})

export const {useLazyGetReferrerQuery, useCreateReferrerMutation, useChangeCodeMutation, useCollectBonusesMutation} = referrerApi
