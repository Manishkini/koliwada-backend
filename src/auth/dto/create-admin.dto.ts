import { IsAlpha, IsEmail, IsMongoId, IsNotEmpty, IsPhoneNumber, IsString, Matches, MaxLength, MinLength } from "class-validator"

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
    role: string

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
}
