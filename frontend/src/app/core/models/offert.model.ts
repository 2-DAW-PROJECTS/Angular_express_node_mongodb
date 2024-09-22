export interface Offert {
    slug: string;
    name: string;
    description: string;
    price: number;
    images: string[];
    img: string;
    id_cat: string;
    favorited: boolean;
    favoritesCount: number;
}
