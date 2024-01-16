import { IsAlpha, IsBoolean, IsEmail, IsMongoId, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, Matches, MaxLength, MinLength } from "class-validator"

export class CreateAdminDto {
    @IsNotEmpty()
    @IsAlpha()
    @IsString()
    firstName: string

    @IsNotEmpty()
    @IsAlpha()
    @IsString()
    middleName: string

    @IsNotEmpty()
    @IsAlpha()
    @IsString()
    lastName: string

    @IsNotEmpty()
    @IsMongoId()
    responsibility: string

    @IsNotEmpty()
    @IsMongoId()
    village: string

    @IsNotEmpty()
    @IsPhoneNumber()
    mobileNumber: string

    @IsNotEmpty()
    @IsEmail()
    email: string

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @MaxLength(32)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { message: 'Password is too weak' })
    password: string

    @IsOptional()
    @IsBoolean()
    active: boolean
}


export class CreateAdminPasswordDto {
    @IsNotEmpty()
    @IsString()
    token: string

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @MaxLength(32)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { message: 'Password is too weak' })
    password: string
}