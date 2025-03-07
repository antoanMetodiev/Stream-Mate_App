import { User } from "../../../../../../types/User";
import style from "./UserDetailsHeader.module.css";
import deffaultUserImage from "./../../../../images/deffault-user-image.jpg";
import { useEffect, useState } from "react";
import axios from "axios";
import { FriendRequest } from "../../../../../../types/FriendRequest";

interface UserDetailsHeaderProps {
    searchedUser: User;
    showPictures: boolean;
    myData: User;
    setMyData: React.Dispatch<React.SetStateAction<User>>;
    setShowPictures: React.Dispatch<React.SetStateAction<boolean>>;
};

export const UserDetailsHeader = ({
    searchedUser,
    myData,
    setMyData,
    showPictures,
    setShowPictures,
}: UserDetailsHeaderProps) => {
    const BASE_URL = window.location.href.includes("local") ? "http://localhost:8080" : "https://streammate-org.onrender.com";

    // States:
    const [weAreFriends, setWeAreFriends] = useState<boolean>(false);
    const [requestSent, setRequestSent] = useState<boolean>(false);

    useEffect(() => {
        setWeAreFriends(checkIfWeAreFriends());
        setRequestSent(isRequestAlreadySent());
    }, [myData, searchedUser]);

    const checkIfWeAreFriends = (): boolean => {
        return myData.friends.some(friend => friend.username === searchedUser.username);
    };

    const isRequestAlreadySent = (): boolean => {
        return myData.sentFriendRequests.some(request => request.receiverUsername === searchedUser.username);
    };

    const sendFriendRequest = async () => {
        try {
            // Вземи стойностите, които ще използваш
            const myUsername = myData.username;
            const wishedFriendUsername = searchedUser.username;
            const myNames = myData.firstName + " " + myData.lastName; // Ще приемем, че името е в myData
            const searchedUserNames = searchedUser.firstName + " " + searchedUser.lastName; // Ще приемем, че името на търсения потребител е в searchedUser
            const myImgURL = myData.profileImageURL; // Ще приемем, че имидж URL е в myData
            const searchedUserImgURL = searchedUser.profileImageURL; // Ще приемем, че имидж URL е в searchedUser

            // Изпращане на friend request
            await axios.post(
                `${BASE_URL}/send-friend-request`,
                { myUsername, wishedFriendUsername },
                { withCredentials: true }
            );

            debugger;
            // Създаване на новия FriendRequest обект
            const newFriendRequest = {
                senderUsername: myUsername,
                senderNames: myNames,
                senderImgURL: myImgURL,
                receiverUsername: wishedFriendUsername,
                receiverNames: searchedUserNames,
                receiverImgURL: searchedUserImgURL,
                sentAt: new Date().toISOString(), // Генерираме време на изпращане
            } as FriendRequest; // Типизираме го като FriendRequest

            debugger;
            // 1. Копираме стария масив и добавяме новата заявка
            const updatedRequests = [...myData.sentFriendRequests, newFriendRequest];

            // 2. Обновяваме състоянието
            setMyData(prevData => ({
                ...prevData,
                sentFriendRequests: updatedRequests
            }))

            // Потвърждаваме, че заявката е изпратена
            setRequestSent(true);
        } catch (error) {
            console.error(error);
            alert("There was an error sending the friend request. Please try again.");
        }
    };

    const rejectFriendRequest = async () => {

        debugger;
        try {
            const apiResponse = await axios.delete(`${BASE_URL}/reject-sended-friend-request/${myData.username}/${searchedUser.username}`, {
                withCredentials: true
            });

            if (!apiResponse.data) throw new Error("The Request is not happened!");

            // Актуализираме данните - премахваме заявката от `receivedFriendRequests`
            setMyData(prevData => ({
                ...prevData,
                sentFriendRequests: prevData.sentFriendRequests.filter(
                    request => request.receiverUsername !== searchedUser.username
                ),
            }));

            setRequestSent(false);
        } catch (error) {
            console.log(error);
        };
    };

    console.log(myData);


    const isMyProfile = myData.username === searchedUser.username;

    return (
        <div className={style['user-details-header']}>
            <div className={style['img-name-wrapper-container']}>
                <img
                    className={style['profile-image']}
                    src={searchedUser.profileImageURL || deffaultUserImage}
                    alt="Профилна снимка"
                />
                <div className={style['names-username-container']}>
                    <h4 className={style['profile-text']}>Профил</h4>
                    <h2 className={style['username']}>{searchedUser.username}</h2>
                    <h2 className={style['name']}>{searchedUser.firstName + " " + searchedUser.lastName}</h2>
                </div>
            </div>

            <section className={style['friends_playlists-count-wrapper-container']}>
                <h5>0 снимки</h5> • <h5>0 приятели</h5>
            </section>

            {/* Рендериране на бутони според състоянието */}
            {isMyProfile ? (
                <h5 className={style['add-friend-button']}>Мой профил</h5>
            ) : weAreFriends ? (
                <h5 className={style['add-friend-button']}>Приятели</h5>
            ) : myData.sentFriendRequests.filter(request => request.receiverUsername === searchedUser.username).length > 0 ? (
                <h5 onClick={rejectFriendRequest} className={style['add-friend-button']}>Отмяна на поканата</h5>
            ) : (
                <h5 onClick={sendFriendRequest} className={style['add-friend-button']}>
                    Добавяне на приятел
                </h5>
            )}

            <div className={style['options-container']}>
                <h5 className={showPictures ? style["publish-playlist-category-h5"] : ""} onClick={() => setShowPictures(true)}>
                    Снимки
                </h5>
                <h5 className={!showPictures ? style["publish-playlist-category-h5"] : ""} onClick={() => setShowPictures(false)}>
                    Приятели
                </h5>
            </div>
        </div>
    );
};
