import {useDispatch, useSelector} from "react-redux";
import {Card} from "../../../shared/ui/Card";
import {Text} from "../../../shared/ui/Text";
import {Input} from "../../../shared/ui/Input";
import {getChatRooms, getCurrentRoom, getMessages} from "../../../entities/Chat/model/selectors/chatSelectors";
import {SyntheticEvent, useEffect, useState} from "react";
import {Button} from "../../../shared/ui/Button";
import {getCurrentUserId} from "../../../entities/User/model/selectors/userSelectors";
import {setNewMessage, setRoomId} from "../../../entities/Chat/model/slices/chatSlice";
import cls from './Chat.module.scss'

export const ChatM = () => {
    const [text, setText] = useState('')
    const [curRoom, setCurRoom] = useState<number | null>(null)
    const messages = useSelector(getMessages)
    const room_id = useSelector(getCurrentRoom)
    const user = useSelector(getCurrentUserId)
    const rooms = useSelector(getChatRooms)
    const dispatch = useDispatch()

    useEffect(() => {
        console.log('rooms', rooms)
        if(!curRoom && rooms.length > 0) {
            setCurRoom(rooms[0].id)
        }
    }, [rooms])
    const handleRoomSelect = (e: SyntheticEvent<HTMLSelectElement>) => {
        setCurRoom(Number(e.currentTarget.value))
        console.log(curRoom)
    }
    const handleSubmit = () => {
        if(user && text.length > 0) {
            dispatch(setNewMessage({user_id: user, room_id, content: text}))
        }
    }
    useEffect(() => {
        if(curRoom) {
            dispatch(setRoomId(curRoom))
        }
    }, [curRoom])
    console.log(messages, 'messages')
    console.log('cur room', curRoom)
    return (
        <>
            <Card className={cls.chat}>
                <select onChange={(e) => handleRoomSelect(e)}>
                    {rooms && rooms.map(room => <option value={room.id}>{room.room_name}</option>)}
                </select>
                <div className={cls.message_list}>
                    {(messages && messages.length > 0) && messages.map(message => <Card>
                        <Text title={message.user.nickname} />
                        <Text text={message.content}/>
                    </Card>)}
                </div>
                <Input value={text} onChange={(value) => setText(value)}></Input>
                <Button onClick={() => handleSubmit()}>Send</Button>
            </Card>
        </>

    )
}
