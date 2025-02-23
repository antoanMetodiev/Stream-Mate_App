import { Series } from "./Series";
import { ImageType } from "./enums/ImageType";

export type SeriesImage = {
    id: string; // UUID
    imageType: ImageType; // Enum тип за вида на изображението
    imageURL: string; // Минимална дължина 5 символа
    series: Series; // Свързан сериал
};
