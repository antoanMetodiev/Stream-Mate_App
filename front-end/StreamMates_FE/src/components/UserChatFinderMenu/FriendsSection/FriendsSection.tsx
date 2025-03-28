import { User } from "../../../types/User";
import style from "./FriendsSection.module.css";
import { MyFriend } from "./MyFriend/MyFriend";

interface FriendSectionProps {
    user: User;
};

export const FriendsSection = ({
    user,
}: FriendSectionProps) => {



    return (
        <section className={style['received-friend-requests-container']}>
           

            <h3 className={style['friend-requests-h3']}>Friends</h3>
            <span className={style['bound-line']}></span>

            {/* USERS LIST: */}
            <section className={style['users-list']}>
                {user.friends.map(friend => {
                    return (
                        <>
                            <MyFriend
                                key={friend.id}
                                friend={friend}
                            />
                        </>
                    );
                })};
            </section>
        </section>
    );
}