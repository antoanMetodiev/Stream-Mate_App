import style from "./UserChatFinderMenu.module.css";
import { useEffect, useState } from "react";

import logoIcon from "./images/user.png";
import chatIcon from "./images/chat.png";
import usersIcon from "./images/users.png";
import receivedFriendRequestsIcon from "./images/received-friend-requests.png";
import friendsIcon from "./images/friends.png";

import { FindUsers } from "./FindUsers/FindUsers";
import { User } from "../../types/User";
import { ReceivedFriendRequests } from "./ReceivedFriendRequests/ReceivedFriendRequests";
import { FriendsSection } from "./FriendsSection/FriendsSection";

interface UserChatFinderMenuProps {
    user: User;
    setUser: React.Dispatch<React.SetStateAction<User>> | null;
};

export const UserChatFinderMenu = ({
    user,
    setUser,
}: UserChatFinderMenuProps) => {
    if (!user) return;

    const [showMenu, setShowMenu] = useState(false);

    // Show Sections:
    const [showFindUsersSection, setShowFindUsersSection] = useState(false);
    const [showChatSection, setShowChatSection] = useState(false);
    const [showRecFriendRequestsSection, setShowRecFriendRequestsSection] = useState(false);
    const [showFriendSection, setShowFriendSection] = useState(false);

    const setShowMenuHandler = () => setShowMenu(!showMenu);

    const openConcreteSection = (location: string) => {
        debugger;
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
            {showRecFriendRequestsSection && (
                <ReceivedFriendRequests
                    user={user}
                    setUser={setUser}
                />
            )}
            {showFindUsersSection && <FindUsers user={user} />}
            {showFriendSection && <FriendsSection user={user} />}

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