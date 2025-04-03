import style from "./UserChatFinderMenu.module.css";
import { useState } from "react";

import logoIcon from "./../../images/user-menu-logo.png";
import chatIcon from "./images/chat.png";
import usersIcon from "./images/users.png";
import receivedFriendRequestsIcon from "./images/received-friend-requests.png";
import friendsIcon from "./images/friends.png";
import { FindUsers } from "./FindUsers/FindUsers";
import { User } from "../../types/User";
import { ReceivedFriendRequests } from "./ReceivedFriendRequests/ReceivedFriendRequests";
import { FriendsSection } from "./FriendsSection/FriendsSection";
import { CallNotification } from "../../types/CallNotification";
import { ChatSection } from "./ChatSection/ChatSection";
import { Message } from "../../types/Message";
import { Friend } from "../../types/Friend";
import { VideoCall } from "./ChatSection/Chat/VideoCall/VideoCall";

import skypeSound from "./../../audios/_SKYPE CALL SOUND.mp3";
import { IncomingCall } from "./IncomingCall/IncomingCall";

interface UserChatFinderMenuProps {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    webSocket: WebSocket | null;
    incomingCall: CallNotification | null;

    currentChatFriend: Friend | null;
    setCurrentChatFriend: React.Dispatch<React.SetStateAction<Friend | null>>;
    messagesWithCurrentFriend: Message[] | null;
    setMessagesWithCurrentFriend: React.Dispatch<React.SetStateAction<Message[] | []>>;

    setIncomingCall: React.Dispatch<React.SetStateAction<CallNotification | null>>;
};

export const UserChatFinderMenu = ({
    user,
    setUser,
    webSocket,
    incomingCall,
    setIncomingCall,
    currentChatFriend,
    setCurrentChatFriend,
    messagesWithCurrentFriend,
    setMessagesWithCurrentFriend,
}: UserChatFinderMenuProps) => {
    if (!user) return;

    // States:
    const [isRinging, setIsRinging] = useState(false);
    const [openCallSection, setOpenCallSection] = useState(false);
    const [showMenu, setShowMenu] = useState(false);

    // Show Sections:
    const [showFindUsersSection, setShowFindUsersSection] = useState(false);
    const [showChatSection, setShowChatSection] = useState(false);
    const [showRecFriendRequestsSection, setShowRecFriendRequestsSection] = useState(false);
    const [showFriendSection, setShowFriendSection] = useState(false);

    const setShowMenuHandler = () => setShowMenu(!showMenu);

    const openConcreteSection = (location: string) => {
        if (location == "FindUsers") {
            setShowRecFriendRequestsSection(false);
            setShowFriendSection(false);
            setShowFindUsersSection(!showFindUsersSection);
        } else if (location == "ChatSection") {
            setShowChatSection(!showChatSection);
        } else if (location == "FriendRequests") {
            setShowFindUsersSection(false);
            setShowFriendSection(false);
            setShowRecFriendRequestsSection(!showRecFriendRequestsSection);
        } else if (location == "Friends") {
            setShowFindUsersSection(false);
            setShowRecFriendRequestsSection(false);
            setShowFriendSection(!showFriendSection);
        };

        setShowMenu(false);
    };


    return (
        <section className={style['user-chat-finder-menu-container']}>
            {/* Условен рендеринг на звука: */}
            {isRinging && (
                <audio src={skypeSound} loop autoPlay />
            )}

            {incomingCall && incomingCall.caller !== user?.id && (
                <IncomingCall
                    openCallSection={openCallSection}
                    isRinging={isRinging}
                    setIsRinging={setIsRinging}
                    incomingCall={incomingCall}
                    setOpenCallSection={setOpenCallSection}
                />
            )}

            {openCallSection && (
                <VideoCall
                    incomingCall={incomingCall}
                    setIncomingCall={setIncomingCall}
                    setOpenCallSection={setOpenCallSection}
                    isRinging={isRinging}
                    setIsRinging={setIsRinging}
                />
            )}

            {showRecFriendRequestsSection && (
                <ReceivedFriendRequests
                    user={user}
                    setUser={setUser}
                />
            )}
            {showFindUsersSection && <FindUsers user={user} setShowFindUsersSection={setShowFindUsersSection} />}
            {showFriendSection && <FriendsSection user={user} />}
            {showChatSection && (
                <ChatSection
                    user={user}
                    webSocket={webSocket}

                    currentChatFriend={currentChatFriend}
                    setCurrentChatFriend={setCurrentChatFriend}
                    messagesWithCurrentFriend={messagesWithCurrentFriend}
                    setMessagesWithCurrentFriend={setMessagesWithCurrentFriend}
                    openCallSection={openCallSection}
                    setOpenCallSection={setOpenCallSection}

                    incomingCall={incomingCall}
                    setIncomingCall={setIncomingCall}
                    setIsRinging={setIsRinging}
                />
            )}

            {showMenu && (
                <section className={style['menu-container']}>
                    <img onClick={() => { openConcreteSection("Friends"); }} src={friendsIcon} alt="friendsIcon" />
                    <img onClick={() => { openConcreteSection("FriendRequests"); }} src={receivedFriendRequestsIcon} alt="receivedFriendRequestsIcon" />
                    <img onClick={() => { openConcreteSection("FindUsers"); }} src={usersIcon} alt="usersIcon" />
                    <img onClick={() => { openConcreteSection("ChatSection"); }} src={chatIcon} alt="chatIcon" />
                </section>
            )}

            <img onClick={setShowMenuHandler} className={style['logoIcon-img']} src={logoIcon} alt="logoIcon" />
        </section>
    );
};