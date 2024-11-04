import { IsEmail, IsNotEmpty, IsString, IsBoolean, IsArray, IsDate, IsNumber } from 'class-validator';

export class CreateUserAdminDto {

    @IsString()
    @IsNotEmpty()
    readonly userType!: 'Admin' | 'SuperAdmin';

    @IsBoolean()
    @IsNotEmpty()
    readonly isActive!: boolean;

    @IsEmail()
    @IsNotEmpty()
    readonly email!: string;

    @IsArray()
    @IsString({ each: true })
    readonly permissions!: string[];

    @IsDate()
    @IsNotEmpty()
    readonly createdAt: Date = new Date();

    @IsDate()
    @IsNotEmpty()    
    readonly updatedAt: Date = new Date();

    @IsArray()
    @IsString({ each: true })
    readonly userEnterpriseIds!: string[];

    @IsString()
    @IsNotEmpty()
    readonly username!: string;

    @IsString()
    @IsNotEmpty()
    readonly password!: string;
}

// import { IsString, IsEmail, IsNotEmpty, MinLength } from 'class-validator';

// export class CreateUserAdminDto {
//     @IsString()
//     @IsNotEmpty()
//     readonly username!: string;

//     @IsEmail()
//     @IsNotEmpty()
//     readonly email!: string;

//     @IsString()
//     @MinLength(6)
//     @IsNotEmpty()
//     readonly password!: string;
// }