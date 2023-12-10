import {
    IsAlpha,
    IsBoolean,
    IsEmail,
    IsMongoId,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsPhoneNumber,
    IsString,
    Matches,
    MaxLength,
    MinLength
} from "class-validator"
import { Admin } from "src/schemas/admin.schema"
import { Village } from "src/schemas/village.schema"

export class CreateUserDto {
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
    @IsPhoneNumber()
    mobileNumber: string

    @IsNotEmpty()
    @IsEmail()
    email: string

    @IsMongoId()
    @IsNotEmpty()
    village: Village

    @IsOptional()
    @IsString()
    profilePic: string

    @IsOptional()
    @IsString()
    highestQualification: string

    @IsOptional()
    @IsNumber()
    birthDay: number

    @IsOptional()
    @IsNumber()
    birthMonth: number

    @IsOptional()
    @IsNumber()
    birthYear: number

    @IsOptional()
    @IsString()
    panCard: string

    @IsOptional()
    @IsString()
    aadharCard: string

    @IsOptional()
    @IsBoolean()
    isMobileNumberVerified: boolean

    @IsOptional()
    @IsBoolean()
    isEmailVerified: boolean

    @IsOptional()
    @IsBoolean()
    isVillageVerified: boolean

    @IsOptional()
    @IsBoolean()
    isProfilePicVerified: boolean

    @IsOptional()
    @IsBoolean()
    isPanCardVerified: boolean

    @IsOptional()
    @IsBoolean()
    isAadharCardVerified: boolean

    @IsMongoId()
    @IsOptional()
    verifiedBy: Admin

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