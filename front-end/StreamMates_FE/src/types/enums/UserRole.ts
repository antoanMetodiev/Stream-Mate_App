import { User } from "../User";

export type UserImage = {
    id: string; // UUID ще се мапва към string
    image_url: string; // Съответства на image_url в Java
    owner: User; // Референция към User типа
    description: string,
};
