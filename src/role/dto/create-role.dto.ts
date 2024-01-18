import { IsAlpha, IsNotEmpty, IsNumber, IsString, Matches } from "class-validator"

export class CreateRoleDto {
    @IsNotEmpty()
    @IsString()
    @Matches(/^[A-Za-z\s]+$/, { message: 'Please enter role name in english and only space is allowed' })
    name: string

    @IsNotEmpty()
    @Matches(/^[ऀ-ॿ\s]+$/, { message: 'Please enter role name in marathi' })
    nameNative: string

    @IsNotEmpty()
    @IsString()
    slug: string
}
