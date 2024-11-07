import { IsEmail, IsNotEmpty, IsString, IsBoolean, IsArray, IsIn, MinLength, IsOptional } from 'class-validator';

export class CreateUserAdminDto {
    @IsIn(['admin', 'superAdmin'])  // Asegúrate de que esté en minúsculas
    @IsNotEmpty()
    usertype!: 'admin' | 'superAdmin';

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

