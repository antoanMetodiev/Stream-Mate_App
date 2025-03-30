import { UserImageType } from "./enums/UserImageType";

export type UserImage = {
    id?: string; // UUID
    imageUrl: string; // URL на изображението
    userImageType: UserImageType; // Тип на изображението
    description?: string; // Описание (може да бъде null или празно)
    ownerId: string;
};