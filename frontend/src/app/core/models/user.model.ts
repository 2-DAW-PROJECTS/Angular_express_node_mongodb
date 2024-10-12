export interface User {
  _id: string;
  email: string;
  token: string;
  username: string;
  bio: string;
  image: string;
  refreshToken: string;
  city: string;  
  aboutMe: string; 
  skills: string[]; 
  followers: User[]; 
  followingUsers: User[];
  isFollowing?: boolean; // Nueva propiedad para indicar si se sigue al usuario
}
