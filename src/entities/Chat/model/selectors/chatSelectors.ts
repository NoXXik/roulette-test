import {StateSchema} from "../../../../app/providers/StoreProvider/config/StateSchema";


export const getCurrentRoom = (state: StateSchema) => state.chat.room_id;
export const getMessages = (state: StateSchema) => state.chat.messages;
export const getNewMessage = (state: StateSchema) => state.chat.new_message;
export const getChatRooms = (state: StateSchema) => state.chat.rooms
// export const getCurrentRoom = (state: StateSchema) => state.chat.room_id;
