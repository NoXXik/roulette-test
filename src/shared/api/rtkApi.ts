import { createApi } from '@reduxjs/toolkit/query/react';
import {baseQueryWithReauth} from "./baseQuery";

export const rtkApi = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithReauth,
    endpoints: () => ({}),
    tagTypes: ['referrer', 'user']

});
