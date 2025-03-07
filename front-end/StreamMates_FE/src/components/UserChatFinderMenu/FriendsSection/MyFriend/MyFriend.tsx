import style from "./MyFriend.module.css";
import { Friend } from "../../../../types/Friend";

import deffaultUserImage from "./../../images/deffault-user-image.jpg";

interface MyFriendProps {
    friend: Friend;
};

export const MyFriend = ({
    friend,
}: MyFriendProps) => {


    return (
        <div
            // onClick={showUserDetailsHandler}
            className={style['user-container']}
        >
            <img
                className={style['user-image']}
                src={friend ? friend.profileImageURL : deffaultUserImage}
                alt={friend ? friend.profileImageURL : ""}
            />
            <div className={style['meta-data-info-container']}>
                <h3 className={style['username']}>{friend.username.length > 15 ? friend.username.slice(0, 14) + ".." : friend.username}</h3>
                <h3 className={style['names']}>
                    {(friend.firstName + " " + friend.lastName).length > 15 ?
                        (friend.firstName + " " + friend.lastName).slice(0, 14) + ".." : (friend.firstName + " " + friend.lastName)}
                </h3>
            </div>

            <div className={style['accept-reject-request-container']}>
                <button>Приятели</button>
            </div>
        </div>
    );
};