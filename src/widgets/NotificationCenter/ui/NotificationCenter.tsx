import {useEffect, useRef, useState} from "react";

import {Icons, toast} from "react-toastify";
import {motion, AnimatePresence} from "framer-motion";

import {useNotificationCenter} from "react-toastify/addons/use-notification-center";
import styled from "styled-components";

import {Trigger} from "../../../shared/ui/Trigger/Trigger";
import {ItemActions} from "../../../shared/ui/NotificationActions";
import {Switch} from "../../../shared/ui/Switch/Switch";
import {TimeTracker} from "../../../shared/ui/TimeTracker/TimeTracker";
import {io, Socket} from 'socket.io-client';
import {useDispatch, useSelector} from "react-redux";
import {getCurrentUser} from "../../../entities/User/model/selectors/userSelectors";
import {ChatRooms, Message} from "../../../entities/Chat/model/types/types";
// import {addMessage, setMessages} from "../../../entities/Chat";
import {updateMessage, setMessages, addMessage, updateChatRooms} from "../../../entities/Chat/model/slices/chatSlice";
import {getCurrentRoom, getNewMessage} from "../../../entities/Chat/model/selectors/chatSelectors";

// contains framer-motion variants to animate different parts of the UI
// when the notification center is visible or not
// https://www.framer.com/docs/examples/#variants
const variants = {
    container: {
        open: {
            y: 20,
            opacity: 1,
            x: -500
        },
        closed: {
            y: -10,
            opacity: 0,
            x: 0
        }
    },
    // used to stagger item animation when switching from closed to open and vice versa
    content: {
        open: {
            transition: {staggerChildren: 0.07, delayChildren: 0.2}
        },
        closed: {
            transition: {staggerChildren: 0.05, staggerDirection: -1}
        }
    },
    item: {
        open: {
            y: 0,
            opacity: 1,
            transition: {
                y: {stiffness: 1000, velocity: -100}
            }
        },
        closed: {
            y: 50,
            opacity: 0,
            transition: {
                y: {stiffness: 1000}
            }
        }
    }
};

const UnreadFilter = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  label {
    cursor: pointer;
  }
`;

const Container = styled(motion.aside)`
  width: min(60ch, 100ch);
  border-radius: 8px;
  overflow: hidden;
  position: fixed;
`;

const Footer = styled.footer`
  background: #222;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Content = styled(motion.section)`
  background: #fff;
  height: 400px;
  overflow-y: scroll;
  overflow-x: hidden;
  color: #000;
  padding: 0.2rem;
  position: relative;

  h4 {
    margin: 0;
    text-align: center;
    padding: 2rem;
  }
`;

const IconWrapper = styled.div`
  width: 32px;
`;

const Item = styled(motion.article)`
  display: grid;
  grid-template-columns: 40px 1fr 40px;
  gap: 8px;
  padding: 0.8rem;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 8px;
`;

const Header = styled.header`
  background: #222;
  color: #fff;
  margin: 0;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export function NotificationCenter() {
    const {
        notifications,
        clear,
        markAllAsRead,
        markAsRead,
        remove,
        unreadCount
    } = useNotificationCenter();
    const [showUnreadOnly, toggleFilter] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [curRoom, setCurRoom] = useState<number | null>(null)
    const user = useSelector(getCurrentUser)
    const dispatch = useDispatch()
    const socketRef = useRef<null | Socket>(null);
    const newMessage = useSelector(getNewMessage)
    const roomId = useSelector(getCurrentRoom)
    // const handleMessageSubmit = useCallback((message: CreateMessage) => {
    //
    // }, [socketRef.current])
    useEffect(() => {
        console.log('newMessage', newMessage)
        if (socketRef.current && newMessage) {
            socketRef.current?.emit('sendMessage', newMessage)
        }
    }, [newMessage])
    useEffect(() => {
        if (roomId) {
            setCurRoom(roomId)
        }
        if (roomId && socketRef.current && roomId !== curRoom) {
            socketRef.current?.emit('changeRoom', {from: curRoom, to: roomId})
        }
    }, [roomId])
    useEffect(() => {
        const socket = io('http://localhost:3333', {
            query: {userId: user?.id || null, roomId: 1, webvisorId: localStorage.getItem('webvisor_id')},
            extraHeaders: {
                Authorization: `${localStorage.getItem('access_token')}`,
            },
        });
        socketRef.current = socket
        socketRef.current.on('connection', () => {
            console.log("Соединение с сервером Socket.IO установлено", socket.id);
        });
        socketRef.current.on('notification', (data: string) => {
            toast(data)
        });
        socketRef.current.on('lastMessages', (data: Message[]) => {
            dispatch(setMessages(data))
        });
        socketRef.current.on('newMessage', (data: Message) => {
            console.log('newMessage', data)
            dispatch(addMessage(data))
        });
        socketRef.current.on('hideMessage', (data: Message) => {
            dispatch(updateMessage(data))
        });
        socketRef.current.on('updateChatRooms', (data: ChatRooms[]) => {
            dispatch(updateChatRooms(data))
        });

        return (() => {
            if (socketRef.current)
                socketRef.current?.disconnect();
            if (socket) {
                socket.disconnect()
            }
        })

    }, [])

    return (
        <div>
            <Trigger onClick={() => setIsOpen(!isOpen)} count={unreadCount}/>
            <Container
                initial={false}
                variants={variants.container}
                animate={isOpen ? "open" : "closed"}
            >
                <Header>
                    <h3>Notifications</h3>
                    <UnreadFilter>
                        <label htmlFor="unread-filter">Only show unread</label>
                        <Switch
                            id="unread-filter"
                            checked={showUnreadOnly}
                            onChange={() => {
                                toggleFilter(!showUnreadOnly);
                            }}
                        />
                    </UnreadFilter>
                </Header>
                <AnimatePresence>
                    <Content
                        variants={variants.content}
                        animate={isOpen ? "open" : "closed"}
                    >
                        {(!notifications.length ||
                            (unreadCount === 0 && showUnreadOnly)) && (
                            <motion.h4
                                initial={{opacity: 0}}
                                animate={{opacity: 1}}
                                exit={{opacity: 0}}
                            >
                                Your queue is empty! you are all set{" "}
                                <span role="img" aria-label="dunno what to put">
                  🎉
                </span>
                            </motion.h4>
                        )}
                        <AnimatePresence>
                            {(showUnreadOnly
                                    ? notifications.filter((v) => !v.read)
                                    : notifications
                            ).map((notification) => {
                                return (
                                    <motion.div
                                        key={notification.id}
                                        layout
                                        initial={{scale: 0.4, opacity: 0, y: 50}}
                                        exit={{
                                            scale: 0,
                                            opacity: 0,
                                            transition: {duration: 0.2}
                                        }}
                                        animate={{scale: 1, opacity: 1, y: 0}}
                                        style={{padding: "0.8rem"}}
                                    >
                                        <Item key={notification.id} variants={variants.item}>
                                            <IconWrapper>
                                                {notification.icon ?
                                                    <>notification.icon</>
                                                    :
                                                    Icons.info({
                                                        theme: notification.theme || "light",
                                                        type: toast.TYPE.INFO
                                                    })}
                                            </IconWrapper>
                                            <div>
                                                <div>{notification.content && <>{notification.content}</>}</div>
                                                <TimeTracker createdAt={notification.createdAt}/>
                                            </div>
                                            <ItemActions
                                                notification={notification}
                                                markAsRead={markAsRead}
                                                remove={remove}
                                            />
                                        </Item>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </Content>
                </AnimatePresence>
                <Footer>
                    <button onClick={clear}>Clear All</button>
                    <button onClick={markAllAsRead}>Mark All as read</button>
                </Footer>
            </Container>
        </div>
    );
}
