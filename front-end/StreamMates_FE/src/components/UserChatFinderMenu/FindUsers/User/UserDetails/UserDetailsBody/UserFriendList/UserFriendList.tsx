import style from "./UserFriendList.module.css";


export const UserFriendList = () => {


    return (
        <article className={style['friends-list-container-wrapper']}>
            {/* <SearchEngine
                userDetailsData={userDetailsData}
                setFilteredFriends={setFilteredFriends}
            /> */}

            <h3 className={style['friends-h3-title']}>Приятели</h3>

            {/* <section className={style['friends-list-container']}>

                {filteredFriends.length > 0 ?
                    filteredFriends.map(friend => {
                        return (
                            <div className={style['friend-container']}>
                                <img
                                    className={style['friend-img']}
                                    src={friend.imgURL}
                                    alt="friend.imgURL"
                                />
                                <h5 className={style['friend-name']}>{friend.name}</h5>
                            </div>
                        )
                    }
                    ) : (
                        <>
                            {userDetailsData.friendsList.length > 0 && userDetailsData.friendsList.map(friend => {
                                return (
                                    <>
                                        <div className={style['friend-container']}>
                                            <img
                                                className={style['friend-img']}
                                                src={friend.imgURL}
                                                alt="friend.imgURL"
                                            />
                                            <h5 className={style['friend-name']}>{friend.name}</h5>
                                        </div>
                                    </>
                                )
                            })}
                        </>
                    )}

            </section> */}
        </article>
    );
};