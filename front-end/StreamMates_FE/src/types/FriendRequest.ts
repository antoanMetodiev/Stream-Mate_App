export interface FriendRequest {
    id: string;
    senderUsername: string;
    senderNames: string;
    senderImgURL?: string;
    receiverUsername: string;
    receiverNames: string;
    receiverImgURL?: string;
    sentAt: string; // Instant може да се представи като ISO дата-стринг
};
  