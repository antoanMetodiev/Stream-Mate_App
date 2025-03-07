import style from "./UserDetailsBody.module.css";
import { useState } from "react";
import { UserPictures } from "./UserPictures/UserPictures";
import { UserFriendList } from "./UserFriendList/UserFriendList";
import { User } from "../../../../../../types/User";

interface UserDetailsBodyProps {
    searchedUser: User;
    myData: User;
    showPictures: boolean;
};

export const UserDetailsBody = ({
    searchedUser,
    myData,
    showPictures,
}: UserDetailsBodyProps) => {
    



    return (
        <article className={style['user-details-body']}>
            {showPictures ? (
                <UserPictures
                    userOwner={searchedUser}
                    myData={myData}
                />
            ) : (
                <UserFriendList />
            )}
        </article>
    );
};