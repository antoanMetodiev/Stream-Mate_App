import style from "./UserDetailsBody.module.css";
import { UserPictures } from "./UserPictures/UserPictures";
import { UserFriendList } from "./UserFriendList/UserFriendList";
import { User } from "../../../../../../types/User";

interface UserDetailsBodyProps {
    searchedUser: User | null;
    myData: User | null;
    showPictures: boolean;
    setSearchedUser: React.Dispatch<React.SetStateAction<User | null>>;
};

export const UserDetailsBody = ({
    searchedUser,
    myData,
    showPictures,
    setSearchedUser,
}: UserDetailsBodyProps) => {
    


    return (
        <article className={style['user-details-body']}>
            {showPictures ? (
                <UserPictures
                    userOwner={searchedUser}
                    setUserOwner={setSearchedUser}
                    myData={myData}
                    
                />
            ) : (
                <UserFriendList myData={myData} searchedUser={searchedUser} />
            )}
        </article>
    );
};