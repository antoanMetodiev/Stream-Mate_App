import style from "./UserSender.module.css";
import deffaultUserImage from "./../../images/deffault-user-image.jpg";

import { FriendRequest } from "../../../../types/FriendRequest";

import axios from "axios";
import { User } from "../../../../types/User";

interface UserSenderProps {
    userSender: FriendRequest;
    setMyUserData: React.Dispatch<React.SetStateAction<User>> | null;
};

export const UserSender = ({
    userSender,
    setMyUserData,
}: UserSenderProps) => {
    if (!setMyUserData) return;
    const BASE_URL = window.location.href.includes("local") ? "http://localhost:8080" : "https://streammate-org.onrender.com";

    // Изпращам заявка:
    const acceptRequestHandler = async () => {
        const myUsername = userSender.receiverUsername;
        const wishedFriendUsername = userSender.senderUsername;

        try {
            const apiReponse = await axios.post(BASE_URL + "/accept-friend-request", { myUsername, wishedFriendUsername }, { withCredentials: true });
            console.log(apiReponse.data);

        } catch (error) {
            console.log(error);
        };
    };

    // Изтривам заявка:
    const rejectRequestHandler = async () => {
        debugger;
        const myUsername = userSender.receiverUsername;
        const wishedFriendUsername = userSender.senderUsername;

        debugger;
        try {
            await axios.delete(
                `${BASE_URL}/reject-received-friend-request/${wishedFriendUsername}/${myUsername}`,
                { withCredentials: true }
            );

            // Изтриваме заявката от sentFriendRequests
            setMyUserData(prevData => {
                // Филтрираме само тези заявки, които не са за търсения потребител
                const updatedReceivedRequests = prevData.receivedFriendRequests.filter(
                    request => request.senderUsername !== userSender.senderUsername
                );

                return {
                    ...prevData,
                    receivedFriendRequests: updatedReceivedRequests, // Актуализираме списъка
                };
            });

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
                <h3 className={style['username']}>{userSender.senderUsername.length > 15 ? userSender.senderUsername.slice(0, 14) + ".." : userSender.senderUsername}</h3>
                <h3 className={style['names']}>{userSender.senderNames.length > 15 ? userSender.senderNames.slice(0, 14) + ".." : userSender.senderNames}</h3>
            </div>
            <div className={style['accept-reject-request-container']}>
                <button onClick={acceptRequestHandler}>Приеми</button>
                <button onClick={rejectRequestHandler}>Откажи</button>
            </div>
        </div>
    );
};