import { IsNotEmpty, IsPhoneNumber, IsString } from "class-validator"

export class SignInAdminDto {
    @IsNotEmpty()
    @IsPhoneNumber()
    mobileNumber: string

    @IsNotEmpty()
    @IsString()
    password: string
}
