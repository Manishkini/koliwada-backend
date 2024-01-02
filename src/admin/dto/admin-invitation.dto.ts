import { IsAlpha, IsEmail, IsMongoId, IsNotEmpty, IsPhoneNumber, IsString } from "class-validator"
import mongoose from "mongoose"

export class AdminInvitationDto {
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
    @IsString()
    firstNameNative: string

    @IsNotEmpty()
    @IsString()
    middleNameNative: string

    @IsNotEmpty()
    @IsString()
    lastNameNative: string

    @IsNotEmpty()
    @IsMongoId()
    state: mongoose.Schema.Types.ObjectId

    @IsNotEmpty()
    @IsMongoId()
    district: mongoose.Schema.Types.ObjectId

    @IsNotEmpty()
    @IsMongoId()
    tehsil: mongoose.Schema.Types.ObjectId

    @IsNotEmpty()
    @IsMongoId()
    village: mongoose.Schema.Types.ObjectId

    @IsNotEmpty()
    @IsMongoId()
    role: mongoose.Schema.Types.ObjectId

    @IsNotEmpty()
    @IsPhoneNumber()
    mobileNumber: string

    @IsNotEmpty()
    @IsEmail()
    email: string
}
