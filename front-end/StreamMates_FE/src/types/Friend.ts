export type Friend = {
    id: string; // UUID ще се мапва към string
    firstName: string; // Съответства на firstName в Java
    lastName: string; // Съответства на lastName в Java
    profileImageURL?: string; // Опционално, съответства на nullable = true
};