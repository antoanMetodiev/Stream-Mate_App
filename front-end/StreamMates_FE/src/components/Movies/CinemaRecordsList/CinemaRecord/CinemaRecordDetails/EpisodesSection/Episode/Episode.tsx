import { constants } from "../../../../../../../constants/constants";
import { Episode } from "../../../../../../../types/EpisodeType";
import style from "./Episode.module.css";

interface EpisodeProps {
    episode: Episode;
    setShowPlayerSection: React.Dispatch<React.SetStateAction<boolean>>;
    setCurrentEpisodeURL: React.Dispatch<React.SetStateAction<string>>;
    playerRef: React.RefObject<HTMLDivElement>; // Тук е корекцията!
}

export const EpisodeComponent = ({
    episode,
    setShowPlayerSection,
    setCurrentEpisodeURL,
    playerRef
}: EpisodeProps) => {

    function playEpisode(videoURL: string) {
        debugger;
        setCurrentEpisodeURL(videoURL);
        setShowPlayerSection(true);
        // Скролва до плеъра
       
        setTimeout(() => {
            playerRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    };


    return (
        <section onClick={() => { playEpisode(episode.videoURL) }} className={style['episode-container']}>
            <img src={constants.TMDB_IMG_URL + episode.posterImgURL} alt={episode.videoURL} />
            <div className={style['content-container']}>
                <h2 className={style['title']}>{episode.episodeTitle}</h2>
                <h4>{"Episode " + episode.episodeNumber}</h4>
                <h3 className={style['air-date']}>{"Air Date: " + episode.airDate}</h3>
                <h4 className={style['description']}>{episode.description && episode.description?.length > 219 ? episode.description?.slice(0, 219) + ".." : episode.description}</h4>
                <h4 className={style['runtime']}>{"Runtime: " + episode.runtime}</h4>
                <h4 className={style['tmdb-rating']}>{"TMDB Rating: " + episode.tmdbRating}</h4>
            </div>
        </section>
    );
};