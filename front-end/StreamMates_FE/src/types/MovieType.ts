import { ActorType } from "./ActorType";
import { MovieImage } from "./MovieImage";

export type Movie = {
    id: string,
    title: string; // Не може да бъде null, трябва да има минимум 2 символа
    posterImgURL: string; // Не може да бъде null, трябва да има минимум 8 символа
    specialText?: string; // Може да бъде null
    genres?: string; // Може да бъде null
    description?: string; // Текстово поле
    releaseDate?: string; // Може да бъде null
    tmdbRating: string; // Рейтинг, не може да бъде null
    backgroundImg_URL: string; // Не може да бъде null, трябва да има минимум 10 символа
    castList: ActorType[]; // Списък с актьори, задължително поле
    videoURL: string; // Не може да бъде null
    imagesList: MovieImage[]; // Списък с изображения, задължително поле
};
  