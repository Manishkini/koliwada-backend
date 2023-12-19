import { IsEmail, IsMongoId, IsNotEmpty, IsPhoneNumber } from "class-validator"
import mongoose from "mongoose"

export class AdminInvitationDto {
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
