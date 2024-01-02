import { IsArray, IsNotEmpty } from "class-validator"

export class CreateRoleDto {
    @IsNotEmpty()
    name: string

    @IsNotEmpty()
    nameNative: string

    @IsNotEmpty()
    slug: string

    @IsArray()
    permissions: object[]
}
