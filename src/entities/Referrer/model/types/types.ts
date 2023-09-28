import {User} from "../../../User/model/types/types";

export interface ReferrerState {
    referrer: Referrer | null
}
export interface Referrer {
    id: number;
    code: string;
    level: string;
    balance: number;
    earned: number;
    bets_amount: number;
    withdraw_ban: boolean;
    referred_users: User[];
    referrer_id: User;
    created_at: Date;
    updated_at: Date;
}
