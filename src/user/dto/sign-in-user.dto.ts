import { IsNotEmpty, IsPhoneNumber, IsString } from "class-validator"

export class SignInUserDto {
    @IsNotEmpty()
    @IsPhoneNumber()
    mobileNumber: string

    @IsNotEmpty()
    @IsString()
    password: string
}
