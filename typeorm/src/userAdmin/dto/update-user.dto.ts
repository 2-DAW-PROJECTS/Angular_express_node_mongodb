import { IsString, IsEmail, IsOptional, MinLength } from 'class-validator';

export class UpdateUserDto {
    @IsString()
    @IsOptional()
    readonly username?: string;

    @IsEmail()
    @IsOptional()
    readonly email?: string;

    @IsString()
    @MinLength(6)
    @IsOptional()
    readonly password?: string;
}