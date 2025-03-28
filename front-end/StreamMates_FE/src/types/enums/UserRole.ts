// import { User } from "../User";

export type UserImage = {
    id?: string; // UUID ще се мапва към string
    imageUrl: string; // Съответства на image_url в Java
    ownerId: string; // Референция към User типа
    description: string,
};
