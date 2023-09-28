import {StateSchema} from "../../../../app/providers/StoreProvider/config/StateSchema";


export const getCurrentUser = (state: StateSchema) => state.user.user;
export const getCurrentUserId = (state: StateSchema) => state.user.user?.id;
