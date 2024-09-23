export interface Offert {
    _id: string;
    title: string;
    company: string;
    location: string;
    description: string;
    requirements: string[];
    salary: number;
    slug: string;
    category: string;
    categorySlug: string;
    postedDate: string;
    image: string;
    __v: number;
  }
  