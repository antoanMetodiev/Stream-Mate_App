export type Friend = {
    id: string; // UUID ще се мапва към string
    username: string,
    fullName: string; // Съответства на firstName в Java
    profileImageURL?: string; // Опционално, съответства на nullable = true
    realUserId: string;
};