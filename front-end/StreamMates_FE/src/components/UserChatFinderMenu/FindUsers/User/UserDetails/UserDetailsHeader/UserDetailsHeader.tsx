import { User } from "../../../../../../types/User";
import style from "./UserDetailsHeader.module.css";
import deffaultUserImage from "./../../../../images/deffault-user-image.jpg";
import { useEffect, useState } from "react";
import axios from "axios";
import { FriendRequest } from "../../../../../../types/FriendRequest";

import deffaultUserBack from "./../../../../../../images/deffault-user-background.webp";
import { useNavigate } from "react-router-dom";

interface UserDetailsHeaderProps {
    searchedUser: User | null;
    showPictures: boolean;
    myData: User | null;
    setMyData: React.Dispatch<React.SetStateAction<User | null>>;
    setShowPictures: React.Dispatch<React.SetStateAction<boolean>>;
};


export const UserDetailsHeader = ({
    searchedUser,
    myData,
    setMyData,
    showPictures,
    setShowPictures,
}: UserDetailsHeaderProps) => {
    const navigate = useNavigate();
    const BASE_URL = window.location.href.includes("local") ? "http://localhost:8080" : "https://married-miquela-stream-mate-org-original-ce114be1.koyeb.app";

    // States:
    const [weAreFriends, setWeAreFriends] = useState<boolean>(false);
    const [requestSent, setRequestSent] = useState<boolean>(false);

    useEffect(() => {
		const fetchUser = async () => {
			try {
				const response = await axios.get(BASE_URL + "/get-user", { withCredentials: true });
				console.log(response.data);
				setMyData(response.data);  
			} catch (error) {
				console.log("Не успяхме да вземем данните на потребителя", error);
				setMyData(null);  // Ако има грешка, не сме логнати
			};
		};

		fetchUser();
	}, []);

    console.log(requestSent);
    useEffect(() => {
        setWeAreFriends(checkIfWeAreFriends());
        setRequestSent(isRequestAlreadySent());
    }, [myData, searchedUser]);

    const checkIfWeAreFriends = (): boolean => {
        if (!searchedUser || !myData || !myData.friends) return false;
        return myData.friends.some(friend => friend.username === searchedUser.username);
    };

    const isRequestAlreadySent = (): boolean => {
        if (!searchedUser || !myData || !myData.sentFriendRequests) return false;
        return myData.sentFriendRequests.some(request => request.receiverUsername === searchedUser.username);
    };

    const sendFriendRequest = async () => {
        if (!myData || !searchedUser) return; // Проверка дали myData и searchedUser не са null

        try {
            // Вземи стойностите, които ще използваш
            const myUsername = myData.username;
            const wishedFriendUsername = searchedUser.username;
            const myNames = myData.fullName; // Ще приемем, че името е в myData
            const searchedUserNames = searchedUser.fullName; // Ще приемем, че името на търсения потребител е в searchedUser
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

            setMyData(prevData => {
                if (!prevData) return prevData;

                return {
                    ...prevData,
                    sentFriendRequests: [...(prevData.sentFriendRequests || []), newFriendRequest]
                };
            });

            // Потвърждаваме, че заявката е изпратена
            setRequestSent(true);
        } catch (error) {
            console.error(error);
            alert("There was an error sending the friend request. Please try again.");
        }
    };

    const rejectFriendRequest = async () => {
        if (!myData || !searchedUser) return; // Проверка дали myData и searchedUser не са null

        debugger;
        try {
            const apiResponse = await axios.delete(`${BASE_URL}/reject-sended-friend-request/${myData.username}/${searchedUser.username}`, {
                withCredentials: true
            });

            if (!apiResponse.data) throw new Error("The Request is not happened!");

            // Актуализираме данните - премахваме заявката от `receivedFriendRequests`
            setMyData(prevData => prevData ? {
                ...prevData,
                sentFriendRequests: prevData.sentFriendRequests.filter(
                    request => request.receiverUsername !== searchedUser.username
                ),
            } : prevData);

            setRequestSent(false);
        } catch (error) {
            console.log(error);
        };
    };

    const isMyProfile = searchedUser && myData?.id === searchedUser.id;

    return (
        <div className={style['user-details-header']}>
            <div className={style['img-name-wrapper-container']}>
                <img
                    className={style['profile-image']}
                    src={searchedUser?.profileImageURL || deffaultUserImage}
                    alt="Профилна снимка"
                />
                <div className={style['names-username-container']}>
                    <h4 className={style['profile-text']}>Профил</h4>
                    <h2 className={style['username']}>{"@" + searchedUser?.username}</h2>
                    <h2 className={style['name']}>{searchedUser?.fullName}</h2>
                </div>
            </div>

            <section className={style['friends_playlists-count-wrapper-container']}>
                <h5>{searchedUser?.images.length} снимки</h5> • <h5>{searchedUser?.friends.length} приятели</h5>
            </section>

            {/* Рендериране на бутони според състоянието */}
            {isMyProfile ? (
                <h5
                    onClick={() => navigate(`/user-details/${myData.username}/edit-profile`, {
                        state: { myData }
                    })}
                    className={style['add-friend-button']}
                >
                    Редактиране на профил
                </h5>
            ) : weAreFriends ? (
                <h5 className={style['add-friend-button']}>Приятели</h5>
            ) : myData && myData.sentFriendRequests && myData?.sentFriendRequests.filter(request => request.receiverUsername === searchedUser?.username).length > 0 ? (
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

            <img
                className={style['deffault-user-background']}
                src={myData?.backgroundImageURL || deffaultUserBack}
                alt="deffaultUserBack"
            />
            <span className={style['black-shadow']}></span>
        </div>
    );
};
