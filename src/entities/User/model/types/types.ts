export interface UserLocalSignin {
    email: string;
    password: string;
}

export interface UserState {
    user: User | null;
    access_token: string | null;
}

export interface User {
    id: number;
    referrer_id?: number | null;
    steam_id?: string | null;
    google_id?: string | null;
    email: string;
    nickname: string;
    password_hash: string;
    settings: UserSettings;
    balance: number;
    role: 'PLAYER' | 'MODERATOR';
    bet_type: number;
    ban: boolean;
    bets_ban: boolean;
    withdraw_ban: boolean;
    chat_ban: boolean;
    chat_ban_expire?: Date | null;
    last_login?: Date | null;
    referrer_comission: number;
    created_at: Date;
}

export interface UserSettings {
    lng: string;
    sound: boolean;
    big_bets: boolean;
    profile_visible: boolean;
    steam_url: string;
}

export type UserRoles = 'PLAYER' | 'MODERATOR'
