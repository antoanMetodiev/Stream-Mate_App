import { constants } from "../../../../../../../constants/constants";
import { ActorType } from "../../../../../../../types/ActorType";
import style from "./Actor.module.css";

interface ActorProps {
    actor: ActorType | undefined;
}

export const Actor = ({
    actor
}: ActorProps) => {

    return (
        <div className={style['actor-container']}>
            <div className={style['actor-img-container-wrapper']}>
                <img
                    className={style['actor-image']}
                    src={actor?.imageURL?.length == 0 ? constants.Actor_BASE_IMG_URL
                        : constants.TMDB_IMG_URL + actor?.imageURL}
                    alt={actor?.nameInRealLife}
                    loading="lazy"
                />
                <span className={style['shadow']}></span>
            </div>
            <h4 className={style['actor-real-name']}>{actor && actor?.nameInRealLife.length >= 17 ? actor?.nameInRealLife.slice(0, 16) + ".." : actor?.nameInRealLife}</h4>
            {/* <h6 className={style['actor-name-in-show']}>{actor.}</h6> */}
        </div>
    );
};