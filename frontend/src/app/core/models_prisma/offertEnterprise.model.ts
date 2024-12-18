export interface Offert {
    _id: string; 
    id: string; 
    title: string;
    company: string;
    location: string;
    description: string;
    requirements: string[];
    salary: number | null;
    slug: string;
    category: string;
    categorySlug: string;
    company_slug: string;
    postedDate: string;
    image: string;
    images?: string[];
    contractType?: string;
    experience?: string;
    __v: number;
    isFavorited?: boolean;
    isActive?: boolean;
}
