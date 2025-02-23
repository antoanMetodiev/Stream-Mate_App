import { ActorType } from "./ActorType";
import { SeriesImage } from "./SeriesImage";
import { Episode } from "./EpisodeType";

export type Series = {
    id: string; // UUID (TypeScript няма вграден тип UUID, използваме string)
    title: string; // Минимум 2 символа, не може да бъде null
    posterImgURL: string; // Минимум 8 символа, не може да бъде null
    specialText?: string; // Може да бъде null
    genres?: string; // Може да бъде null
    description?: string; // Текстово поле, може да бъде null
    releaseDate?: string; // Може да бъде null
    tmdbRating: string; // Рейтинг, не може да бъде null
    backgroundImg_URL: string; // Минимум 10 символа, не може да бъде null
    castList: ActorType[]; // Списък с актьори, задължително поле
    allEpisodes: Episode[]; // Списък с епизоди, задължително поле
    imagesList: SeriesImage[]; // Списък с изображения, задължително поле
    videoURL: string
};