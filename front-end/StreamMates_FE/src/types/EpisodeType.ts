import { Series } from "./Series";

export type Episode = {
    id: string; // UUID
    videoURL: string; // Уникален и задължителен
    posterImgURL?: string; // Може да бъде null
    episodeTitle?: string; // Може да бъде null
    airDate?: string; // Може да бъде null
    description?: string; // Може да бъде null
    runtime?: string; // Може да бъде null
    tmdbRating?: string; // Може да бъде null
    season?: string; // Може да бъде null
    episodeNumber?: string; // Може да бъде null
    series: Series; // Свързан сериал (външен обект)
};
