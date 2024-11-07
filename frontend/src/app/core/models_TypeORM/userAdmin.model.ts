export interface UserAdmin {
    usertype: string;           
    isActive?: boolean;         
    email: string;              
    permissions?: string[];      
    userEnterpriseIds?: string[]; 
    username: string;         
    password?: string;         
}
