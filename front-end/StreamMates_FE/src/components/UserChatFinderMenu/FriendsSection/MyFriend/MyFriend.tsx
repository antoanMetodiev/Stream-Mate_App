import style from "./MyFriend.module.css";
import { Friend } from "../../../../types/Friend";

import deffaultUserImage from "./../../images/deffault-user-image.jpg";

interface MyFriendProps {
    friend: Friend;
};

export const MyFriend = ({
    friend,
}: MyFriendProps) => {


    console.log(friend);
    return (
        <div
            // onClick={showUserDetailsHandler}
            className={style['user-container']}
        >
            <img
                className={style['user-image']}
                src={friend && friend.profileImageURL ? friend.profileImageURL : deffaultUserImage}
                alt={friend && friend.profileImageURL ? friend.profileImageURL : deffaultUserImage}
            />
            <div className={style['meta-data-info-container']}>
                <h3 className={style['username']}>{friend.username.length > 15 ? friend.username.slice(0, 14) + ".." : friend.username}</h3>
                <h3 className={style['names']}>
                    {friend.fullName.length > 15 ?
                        friend.fullName.slice(0, 14) + ".." : friend.fullName}
                </h3>
            </div>

            <div className={style['accept-reject-request-container']}>
                <button>Приятели</button>
            </div>
        </div>
    );
};