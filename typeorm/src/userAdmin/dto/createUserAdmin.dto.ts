import { IsEmail, IsNotEmpty, IsString, IsBoolean, IsArray, IsIn, MinLength, IsOptional } from 'class-validator';

export class CreateUserAdminDto {
    @IsIn(['Admin', 'SuperAdmin'])
    @IsNotEmpty()
    userType!: 'Admin' | 'SuperAdmin';

    @IsBoolean()
    @IsNotEmpty()
    isActive!: boolean;

    @IsEmail()
    @IsNotEmpty()
    email!: string;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    permissions?: string[]; 

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    userEnterpriseIds?: string[];

    @IsString()
    @IsNotEmpty()
    username!: string; 

    @IsString()
    @MinLength(6)
    @IsNotEmpty()
    password!: string;
}
