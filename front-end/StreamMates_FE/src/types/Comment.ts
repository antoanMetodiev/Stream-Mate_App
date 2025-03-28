export type Comment = {
    id?: string;
    commentText: string;
    authorUsername: string;
    authorFullName: string;
    authorImgURL: string;
    authorId: string;
    rating: number;
    createdAt?: string;
    cinemaRecordId: string;
};