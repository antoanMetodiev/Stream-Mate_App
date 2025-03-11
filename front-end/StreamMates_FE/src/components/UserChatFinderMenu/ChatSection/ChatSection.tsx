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
}: ChatSectionProps) => {
    const BASE_URL = window.location.href.includes("local") ? "http://localhost:8080" : "https://streammate-org.onrender.com";
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
            {/* <img
                // ref={showUsersListImgRef}
                // onClick={showUsersListHandler}
                className={style["show-users-list-img"]}
                src={showUserContainer}
                alt="showUserContainer"
            /> */}


            <article className={style["wrapper-all-GalaxyPlay-users"]}>

                {!isOpenMessagesWithUser ? (
                    <section className={style["all-GalaxyPlay-users"]}>
                        {/* <SearchEngine
                            allChatUsers={allChatUsers}
                            setFilteredUsersHandler={setFilteredUsersHandler}
                        /> */}

                        {user && user.friends.length > 0 ? (user.friends).map((chatUser, index) => (
                            <div
                                onClick={() => { openMessagesWithConcreteUser(chatUser.realUserId); }}
                                key={index}
                                className={style["chat-user-item"]}
                            >
                                <img
                                    src={chatUser.profileImageURL ? chatUser.profileImageURL : deffaultUserImage}
                                    alt={`${chatUser.username}'s profile`}
                                />
                                <p>{chatUser.username}</p>
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
                    />
                )}




                {/* {showConcreteChatPermission && (
						<>
							
						</>
					)} */}
            </article>
        </>
    );
};