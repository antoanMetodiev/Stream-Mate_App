import { UserImage, } from "./enums/UserRole";
import { Friend } from "./Friend";
import { FriendRequest } from "./FriendRequest";

export type User = {
    id: string; // UUID ще се мапва към string
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    profileImageURL?: string; // Опционално, съответства на nullable = true
    userRole: string;
    friends: Friend[]; // Предполага се, че имате дефиниран Friend тип
    images: UserImage[]; // Предполага се, че имате дефиниран UserImage тип
    receivedFriendRequests: FriendRequest[],
    sentFriendRequests: FriendRequest[],
};