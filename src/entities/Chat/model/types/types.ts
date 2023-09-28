import {User} from "../../../User/model/types/types";

export interface ChatState {
    messages: Message[],
    room_id: number,
    new_message: CreateMessage | null,
    rooms: ChatRooms[],
}

export interface Message {
    id: number,
    user: Partial<User>,
    content: string;
    hide: boolean;
    hide_moderator?: Partial<User>;
    created_at: Date;
    updated_at: Date;
}

export interface CreateMessage {
    user_id: number;
    content: string;
    room_id: number;
}

export interface ChatRooms {
    id: number;

    room_name: string;

    status: string;  // online | offline

    language: string;  // ru | en | tr

    created_at: Date;

    updated_at: Date;
}
