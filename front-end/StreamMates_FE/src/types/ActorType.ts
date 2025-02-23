import { Series } from "./Series";
import { Movie } from "./MovieType";

export type ActorType = {
    id: string; // UUID (TypeScript няма вграден тип UUID, използваме string)
    seriesParticipations: Series[]; // Списък със сериали
    movieParticipations: Movie[]; // Списък с филми
    imageURL?: string; // Може да бъде null
    biography?: string; // Текстово поле, може да бъде null
    facebookUsername?: string; // Може да бъде null
    instagramUsername?: string; // Може да бъде null
    twitterUsername?: string; // Може да бъде null
    youtubeChannel?: string; // Може да бъде null
    imdbId?: string; // Може да бъде null
    birthday?: string; // Може да бъде null
    knownFor?: string; // Може да бъде null
    placeOfBirth?: string; // Може да бъде null
    gender?: string; // Може да бъде null
    popularity?: string; // Може да бъде null
    nameInRealLife: string; // Не може да бъде null
};