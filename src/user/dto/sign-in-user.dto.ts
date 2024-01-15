import { IsNotEmpty, IsEmail, IsString } from "class-validator"

export class SignInUserDto {
    @IsNotEmpty()
    @IsEmail()
    email: string

    @IsNotEmpty()
    @IsString()
    password: string
}
