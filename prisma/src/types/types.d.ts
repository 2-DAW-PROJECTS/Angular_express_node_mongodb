import { JwtPayload } from 'jsonwebtoken'; 

export interface UserPayload extends JwtPayload {
  userId: string;  
}
  export interface Category {
    id: string;            
    name: string;          
    description?: string;  
    isActive: boolean;     
    jobCount: number;      
    slug: string;          
    image?: string;        
    subcategories: string[]; 
    createdAt: string;     
    updatedAt: string;     
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;  
    }
  }
}
