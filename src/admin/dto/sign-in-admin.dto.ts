import { IsEmail, IsNotEmpty, IsString } from "class-validator"

export class SignInAdminDto {
    @IsNotEmpty()
    @IsEmail()
    email: string

    @IsNotEmpty()
    @IsString()
    password: string
}
