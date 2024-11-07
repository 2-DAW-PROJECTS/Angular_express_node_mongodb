// src/userEnterprise/dto/UserEnterpriseDTO.ts
export interface UserEnterpriseDTO {
    username: string;
    email: string;
    password: string;
    isActive?: boolean;
    permissions?: string[];
}
