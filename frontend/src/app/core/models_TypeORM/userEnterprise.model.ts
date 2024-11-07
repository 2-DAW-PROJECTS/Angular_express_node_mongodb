export interface UserEnterprise {
  _id: string;
  username: string;
  email: string;
  password: string;
  usertype: string;
  isActive: boolean;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
  followers: number;
  logo: string;
  website: string;
  location: string;
  description: string;
  industry: string;
  telephone: string;
}
