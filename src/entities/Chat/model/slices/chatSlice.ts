import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {ChatRooms, ChatState, CreateMessage, Message} from "../types/types";


const initialState: ChatState = {
    room_id: 1,
    new_message: null,
    messages: [],
    rooms: [],
}
const chatSlice = createSlice({
    name: 'chat',
    initialState: initialState,
    reducers: {
        setMessages: (state, action: PayloadAction<Message[]>) => {
            state.messages = action.payload
        },
        addMessage:(state, action: PayloadAction<Message>) => {
            state.messages = state.messages.concat(action.payload)
        },
        updateMessage:(state, action: PayloadAction<Message>) => {
            state.messages = state.messages.map(message => message.id === action.payload.id ? action.payload : message)
        },
        setNewMessage: (state, action: PayloadAction<CreateMessage>) => {
            state.new_message = action.payload
        },
        setRoomId: (state, action: PayloadAction<number>) => {
            state.room_id = action.payload
        },
        updateChatRooms: (state, action: PayloadAction<ChatRooms[]>) => {
            state.rooms = action.payload
        },
    }
})

export const {setNewMessage, updateMessage, setMessages, addMessage, updateChatRooms, setRoomId} = chatSlice.actions
export default chatSlice.reducer

