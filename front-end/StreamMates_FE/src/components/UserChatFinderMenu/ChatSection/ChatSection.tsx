import { CallNotification } from "../../../types/CallNotification";
import { User } from "../../../types/User";
import style from "./ChatSection.module.css";

import deffaultUserImage from "./../images/deffault-user-image.jpg";
import { useState } from "react";
import { Chat } from "./Chat/Chat";
import axios from "axios";
import { Message } from "../../../types/Message";
import { Friend } from "../../../types/Friend";

interface ChatSectionProps {
    user: User | null;
    webSocket: WebSocket | null;
    incomingCall: CallNotification | null;
    setIncomingCall: React.Dispatch<React.SetStateAction<CallNotification | null>>;
    currentChatFriend: Friend | null;
    setCurrentChatFriend: React.Dispatch<React.SetStateAction<Friend | null>>;
    messagesWithCurrentFriend: Message[] | null;
    setMessagesWithCurrentFriend: React.Dispatch<React.SetStateAction<Message[] | []>>;

    openCallSection: boolean;
    setOpenCallSection: React.Dispatch<React.SetStateAction<boolean>>;
    setIsRinging: React.Dispatch<React.SetStateAction<boolean>>;
};

export const ChatSection = ({
    user,
    webSocket,
    incomingCall,
    setIncomingCall,
    currentChatFriend,
    setCurrentChatFriend,
    messagesWithCurrentFriend,
    setMessagesWithCurrentFriend,
    openCallSection,
    setOpenCallSection,
    setIsRinging,
}: ChatSectionProps) => {
    const BASE_URL = window.location.href.includes("local") ? "http://localhost:8080" : "https://dark-sissy-stream-mate-b1e9d2a2.koyeb.app";
    const [isOpenMessagesWithUser, setIsOpenMessagesWithUser] = useState(false);

    const openMessagesWithConcreteUser = async (friendId: string) => {
        setIsOpenMessagesWithUser(true);

        debugger;
        try {
            const apiResponse = await axios.get(BASE_URL + "/get-messages-with-friend", {
                withCredentials: true,
                params: { myId: user?.id, friendId },
            });

            console.log(apiResponse.data);

            const filteredCurrentChatFriend = user?.friends.filter(friend => friend.realUserId === friendId);
            const exp = filteredCurrentChatFriend?.[0] ?? null; // Вземи първия приятел или `null`, ако няма
            if (exp) setCurrentChatFriend(exp); // Задава един приятел или `null`
            setMessagesWithCurrentFriend(apiResponse.data);

        } catch (error) {
            console.log(error);
        };
    };


    return (
        <>
            <article className={style["wrapper-all-GalaxyPlay-users"]}>

                {!isOpenMessagesWithUser ? (
                    <section className={style["all-GalaxyPlay-users"]}>
                        {user && user.friends ? (user.friends).map((chatUser, index) => (
                            <div
                                onClick={() => { openMessagesWithConcreteUser(chatUser.realUserId); }}
                                key={index}
                                className={style["chat-user-item"]}
                            >
                                <img
                                    src={chatUser.profileImageURL ? chatUser.profileImageURL : deffaultUserImage}
                                    alt={`${chatUser.username}'s profile`}
                                />
                                <div className={style['full-name-and-username-container-wrapper']}>
                                    <h4>{"@" + chatUser.username}</h4>
                                    <h3>{chatUser.fullName}</h3>
                                </div>
                            </div>
                        )) : (
                            <h3 className={style['no-friens-h3']}>Добавете приятели за да започнете чат с някого!</h3>
                        )}
                    </section>
                ) : (
                    <Chat
                        user={user}
                        webSocket={webSocket}
                        currentChatFriend={currentChatFriend}
                        messagesWithCurrentFriend={messagesWithCurrentFriend}
                        setMessagesWithCurrentFriend={setMessagesWithCurrentFriend}
                        incomingCall={incomingCall}
                        setIncomingCall={setIncomingCall}

                        openCallSection={openCallSection}
                        setOpenCallSection={setOpenCallSection}
                        setIsOpenMessagesWithUser={setIsOpenMessagesWithUser}
                        setIsRinging={setIsRinging}
                    />
                )}
            </article>
        </>
    );
};