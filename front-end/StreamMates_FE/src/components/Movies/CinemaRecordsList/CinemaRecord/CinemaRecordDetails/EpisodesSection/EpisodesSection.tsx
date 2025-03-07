import { useState } from "react";
import { Episode } from "../../../../../../types/EpisodeType";
import { EpisodeComponent } from "./Episode/Episode";
import style from "./EpisodesSection.module.css";
import { getSeasonEpisodes, orderEpisodes } from "../../../../../../utils/utils";

import Select, { SingleValue } from "react-select";

interface EpisodesSectionProps {
    allEpisodes: Episode[],
    setShowPlayerSection: React.Dispatch<React.SetStateAction<boolean>>;
    setCurrentEpisodeURL: React.Dispatch<React.SetStateAction<string>>;
    playerRef: React.RefObject<HTMLDivElement>; // Тук е корекцията!
}

export const EpisodesSection = ({
    allEpisodes,
    setShowPlayerSection,
    setCurrentEpisodeURL,
    playerRef
}: EpisodesSectionProps) => {
    const [orderedEpisodes] = useState<Episode[]>(orderEpisodes(allEpisodes));
    const [selectedSeason, setSelectedSeason] = useState<string>("1");
    const [seasonEpisodes, setSeasonEpisodes] = useState<Episode[]>(getSeasonEpisodes(selectedSeason, orderedEpisodes));

    // Функция за промяна на сезона
    const handleSeasonChange = (selectedOption: SingleValue<{ value: string; label: string }>) => {
        if (selectedOption) {
            setSelectedSeason(selectedOption.value);
            setSeasonEpisodes(getSeasonEpisodes(selectedOption.value, orderedEpisodes));
        }
    };

    // Създаваме опции за селекта (уникални сезони)
    const seasonOptions = [...new Set(allEpisodes.map((ep) => ep.season))]
        .sort((a, b) => Number(a) - Number(b))
        .map((season) => ({
            value: season !== undefined ? season.toString() : "1",
            label: `Season ${season}`
        }));

    return (
        <section className={style['episode-section-container']}>
            <div className={style['episode-title-season-select-container']}>
                <h2 className={style['episodes-h2-title']}>Episodes</h2>
                {/* Styled React-Select */}
                <Select
                    className={style["custom-select"]}
                    classNamePrefix="custom"
                    value={seasonOptions.find(option => option.value === selectedSeason)}
                    onChange={handleSeasonChange}
                    options={seasonOptions}
                    styles={{
                        control: (base) => ({
                            ...base,
                            backgroundColor: "#1a1a1a",
                            color: "#fff",
                            border: "1px solid #666",
                            width: "200px",
                            cursor: "pointer",
                            textAlign: "center", // Текстът в средата
                        }),
                        menu: (base) => ({
                            ...base,
                            backgroundColor: "#1a1a1a",
                            border: "1px solid #666",
                            width: "200px", // Опциите няма да се разтягат
                            marginTop: "5px",
                        }),
                        option: (base, { isFocused }) => ({
                            ...base,
                            backgroundColor: isFocused ? "#444" : "#1a1a1a",
                            color: "#fff",
                            cursor: "pointer",
                            textAlign: "center",
                        }),
                        singleValue: (base) => ({
                            ...base,
                            color: "#fff",
                        }),
                    }}
                />
            </div>

            <div className={style['episode-list-container']}>
                {seasonEpisodes.map((episode) => (
                    <EpisodeComponent
                        playerRef={playerRef}
                        setShowPlayerSection={setShowPlayerSection}
                        setCurrentEpisodeURL={setCurrentEpisodeURL}
                        episode = { episode }
                        key = { episode.id }
                    />
                ))}
            </div>
        </section>
    );
};
