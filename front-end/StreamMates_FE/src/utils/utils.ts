import { Episode } from "../types/EpisodeType";
import { MovieImage } from "../types/MovieImage";
import { SeriesImage } from "../types/SeriesImage";

export const allGenres = [
    "Action", "Adventure", "Animation", "Comedy", "Crime", "Drama", "Fantasy", "Historical",
    "Horror", "Mystery", "Romance", "Thriller", "Western", "Biography", "Documentary",
    "Family", "Musical", "Sports", "War", "Superhero", "Noir", "Sci-Fi"
];

export function getRandomNumber() {
    return Math.floor(Math.random() * (978 - 266 + 1)) + 266;
};

export function calculateAge(dateString: string): string {
    if (dateString === "") return "";
    const birthDate = new Date(dateString);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--;
    }

    return age.toString();
};

export function formatGenres(genreString: string): string {
    let formattedString = genreString.endsWith(",") ? genreString.slice(0, -1) : genreString;
    formattedString = formattedString.replace(/,/g, ', ');
    if (!formattedString.endsWith('.')) {
        formattedString += '.';
    }
    return formattedString;
}

export function getImagesByTypeAndRange(
    imagesList: (MovieImage[] | SeriesImage[]) | undefined,
    imageType: string,
    startIndex: number,
    endIndex: number | undefined
) {
    if (!imagesList) return [];
    const filteredImages = imagesList.filter(image => image.imageType === imageType);
    if (endIndex === undefined) return filteredImages.slice(startIndex);
    return filteredImages.slice(startIndex, endIndex);
};

export function orderEpisodes(allEpisodes: Episode[]): Episode[] {
    const sortedEpisodes = allEpisodes.sort((oneEpisode, anotherEpisode) => {
        return Number(oneEpisode.episodeNumber) - Number(anotherEpisode.episodeNumber);
    }).sort((oneEpisode, anotherEpisode) => {
        return Number(oneEpisode.season) - Number(anotherEpisode.season);
    });

    return sortedEpisodes;
};

export function getSeasonEpisodes(season: string, allEpisodes: Episode[]) {
    return allEpisodes.filter(episode => episode.season == season);
};
