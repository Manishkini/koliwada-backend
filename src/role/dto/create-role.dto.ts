import { IsAlpha, IsNotEmpty, IsNumber, IsString, Matches } from "class-validator"

export class CreateRoleDto {
    @IsNotEmpty()
    @IsString()
    @IsAlpha()
    name: string

    @IsNotEmpty()
    @Matches(/^[ऀ-ॿ\s]+$/, { message: 'Please enter role name in marathi' })
    nameNative: string

    @IsNotEmpty()
    @IsString()
    slug: string

    @IsNotEmpty()
    @IsNumber()
    rank: number

    // @IsArray()
    // permissions: object[]
}
