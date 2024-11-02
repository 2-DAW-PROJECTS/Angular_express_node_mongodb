import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class LoginUserDto {

    @IsString()
    @IsNotEmpty()
    readonly username!: string;

    @IsEmail()
    @IsNotEmpty()
    readonly email!: string;

    @IsString()
    @IsNotEmpty()
    readonly password!: string;
}