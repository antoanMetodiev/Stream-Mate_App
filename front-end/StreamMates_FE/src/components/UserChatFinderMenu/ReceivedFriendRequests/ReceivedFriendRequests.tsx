import { User } from "../../../types/User";
import style from "./ReceivedFriendRequests.module.css";
import { UserSender } from "./UserSender/UserSender";

interface ReceivedFriendRequestsProps {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

export const ReceivedFriendRequests = ({
    user,
    setUser,
}: ReceivedFriendRequestsProps) => {



    return (
        <section className={style['received-friend-requests-container']}>
            <h3 className={style['friend-requests-h3']}>Friend Requests</h3>
            <span className={style['bound-line']}></span>

            {/* USERS LIST: */}
            <section className={style['users-list']}>
                {user && user.receivedFriendRequests && user.receivedFriendRequests.map(currentUser => {
                    return (
                        <>
                            <UserSender
                                key={currentUser.id}
                                userSender={currentUser}
                                setMyUserData={setUser}
                            />
                        </>
                    );
                })};
            </section>
        </section>
    );
};