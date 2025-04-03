import { useState } from "react";
import style from "./UserFriendList.module.css";
import { Friend } from "../../../../../../../types/Friend";
import { User } from "../../../../../../../types/User";

import deffaultImage from "./../../../../../images/deffault-user-image.jpg";

interface UserFriendListProps {
    myData: User | null;
    searchedUser: User | null;
};

export const UserFriendList = ({
    searchedUser,
}: UserFriendListProps) => {
    const [filteredFriends, setFilteredFriends] = useState<Friend[] | []>([]);

    const filterFriendsWithPattern = (event: React.ChangeEvent<HTMLInputElement>) => {
        const searchValue = event.target.value.toLowerCase(); 
        const resultFilteredFriends = searchedUser && searchedUser.friends.filter(
            friend =>
                friend.username.toLowerCase().startsWith(searchValue) ||
                friend.fullName.toLowerCase().startsWith(searchValue)
        );

        setFilteredFriends(resultFilteredFriends ? resultFilteredFriends : []);
    };

    return (
        <>
            <input className={style['friend-searcher-input']} onChange={filterFriendsWithPattern} name="friend-searcher" type="text" placeholder="Search Friend.."/>
            <h3 className={style['friends-h3-title']}>Приятели</h3>

            <section className={style['friends-list-container']}>

                {filteredFriends.length > 0 ?
                    filteredFriends.map(friend => {
                        return (
                            <div className={style['friend-container']}>
                                <img
                                    className={style['friend-img']}
                                    src={friend.profileImageURL ? friend.profileImageURL : deffaultImage}
                                    alt="friend.imgURL"
                                />
                                <h3 className={style['friend-username-h3']}>{friend.username}</h3>
                                <h5 className={style['friend-name']}>{friend.fullName}</h5>
                            </div>
                        )
                    }
                    ) : (
                        <>
                            {searchedUser && searchedUser.friends.length > 0 && searchedUser.friends.map(friend => {
                                return (
                                    <>
                                        <div className={style['friend-container']}>
                                            <img
                                                className={style['friend-img']}
                                                src={friend.profileImageURL ? friend.profileImageURL : deffaultImage}
                                                alt="friend.imgURL"
                                            />
                                            <h3 className={style['friend-username-h3']}>{"@" + friend.username}</h3>
                                            <h5 className={style['friend-name']}>{friend.fullName}</h5>
                                        </div>
                                    </>
                                )
                            })}
                        </>
                    )}
            </section>
        </>
    );
};