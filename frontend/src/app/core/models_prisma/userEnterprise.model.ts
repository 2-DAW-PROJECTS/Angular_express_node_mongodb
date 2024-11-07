import { of } from "rxjs";
import { Offert } from "./offertEnterprise.model";

export interface UserEnterprise {
    id?: string;
    username: string;
    email: string;
    password?: string;
    usertype: string;  
    isActive?: boolean; 
    permissions?: string[]; 
    telephone?: string; 
    followers?: number; 
    description?: string; 
    industry?: string; 
    location?: string; 
    logo?: string; 
    website?: string; 
    image?: string; 
    slug?: string; 
    category?: string; 
    createdAt?: Date;
    updatedAt?: Date;
}
