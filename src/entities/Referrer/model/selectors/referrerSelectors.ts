import {StateSchema} from "../../../../app/providers/StoreProvider/config/StateSchema";


export const getCurrentReferrer = (state: StateSchema) => state.referrer.referrer;
