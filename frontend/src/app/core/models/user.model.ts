export interface User {
  _id: string;
  email: string;
  token: string | null;
  accessToken?: string;
  username: string;
  usertype: 'user' | 'enterprise'; 
  bio: string;
  image: string;
  refreshToken: string | null; 
  city: string;
  aboutMe: string;
  skills: string[];
  followers: User[];
  followingUsers: User[];
  isFollowing?: boolean;
}
