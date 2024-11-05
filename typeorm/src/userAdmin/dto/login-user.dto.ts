import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class LoginUserDto {
    @IsEmail()
    @IsNotEmpty()
    readonly email!: string;

    @IsString()
    @IsNotEmpty()
    readonly password!: string;
}