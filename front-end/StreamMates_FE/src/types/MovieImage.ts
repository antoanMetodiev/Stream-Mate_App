import { Movie } from "./MovieType";
import { ImageType } from "./enums/ImageType";

export type MovieImage = {
    id: string; // UUID
    imageType: ImageType; // Enum тип за вида на изображението
    imageURL: string; // Минимална дължина 5 символа
    movie: Movie; // Свързан филм
};
