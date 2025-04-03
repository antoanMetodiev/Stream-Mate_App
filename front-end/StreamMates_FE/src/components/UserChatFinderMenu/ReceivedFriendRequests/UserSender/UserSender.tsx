import style from "./UserSender.module.css";
import deffaultUserImage from "./../../images/deffault-user-image.jpg";

import { FriendRequest } from "../../../../types/FriendRequest";

import axios from "axios";
import { User } from "../../../../types/User";

interface UserSenderProps {
    userSender: FriendRequest;
    setMyUserData: React.Dispatch<React.SetStateAction<User | null>>;
};

export const UserSender = ({
    userSender,
    setMyUserData,
}: UserSenderProps) => {
    if (!setMyUserData) return;
    const BASE_URL = window.location.href.includes("local") ? "http://localhost:8080" : "https://married-miquela-stream-mate-org-original-ce114be1.koyeb.app";

    const fetchUser = async () => {
        try {
            const response = await axios.get(BASE_URL + "/get-user", { withCredentials: true });
            console.log(response.data);
            setMyUserData(response.data);  // Записваме потребителските данни
        } catch (error) {
            console.log("Не успяхме да вземем данните на потребителя", error);
            setMyUserData(null);  // Ако има грешка, не сме логнати
        };
    };

    // Изпращам заявка:
    const acceptRequestHandler = async () => {
        const myUsername = userSender.receiverUsername;
        const wishedFriendUsername = userSender.senderUsername;

        try {
            const apiReponse = await axios.post(BASE_URL + "/accept-friend-request", { myUsername, wishedFriendUsername }, { withCredentials: true });
            console.log(apiReponse.data);
            fetchUser();

        } catch (error) {
            console.log(error);
        };
    };

    // Изтривам заявка:
    const rejectRequestHandler = async () => {
        const myUsername = userSender.receiverUsername;
        const wishedFriendUsername = userSender.senderUsername;

        try {
            await axios.delete(
                `${BASE_URL}/reject-received-friend-request/${wishedFriendUsername}/${myUsername}`,
                { withCredentials: true }
            );

            fetchUser();

        } catch (error) {
            console.log(error);
        };
    };


    return (
        <div className={style['user-container']}>
            <img
                className={style['user-image']}
                src={userSender ? userSender.senderImgURL : deffaultUserImage}
                alt={userSender ? userSender.senderImgURL : ""}
            />
            <div className={style['meta-data-info-container']}>
                <h3 className={style['username']}>{userSender.senderUsername.length > 20 ? "@" + userSender.senderUsername.slice(0, 20) + ".." : "@" + userSender.senderUsername}</h3>
                <h3 className={style['names']}>{userSender.senderNames.length > 19 ? userSender.senderNames.slice(0, 19) + ".." : userSender.senderNames}</h3>
            </div>
            <div className={style['accept-reject-request-container']}>
                <button onClick={acceptRequestHandler}>Приеми</button>
                <button onClick={rejectRequestHandler}>Откажи</button>
            </div>
        </div>
    );
};