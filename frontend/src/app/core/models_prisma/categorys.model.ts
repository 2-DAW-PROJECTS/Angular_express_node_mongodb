export interface Category {
    _id: string;
    name: string;
    description: string;
    isActive: boolean;
    jobCount: number;
    slug: string;
    image: string | null;
    subcategories: string[];
  }
  