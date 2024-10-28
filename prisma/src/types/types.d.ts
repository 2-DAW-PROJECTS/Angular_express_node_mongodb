import { JwtPayload } from 'jsonwebtoken'; 

export interface UserPayload extends JwtPayload {
  userId: string;  
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;  
    }
  }
}
