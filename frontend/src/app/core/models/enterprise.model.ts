export interface Enterprise {
    id: number;
    name: string;
    description: string;
    industry: string;
    location: string;
    logo: string;
    website: string;
    contact_email: string;
    contact_phone: string;
    category: string;
    offers: string[];
    createdAt: Date;
    updatedAt: Date;
    slug: string;
}
