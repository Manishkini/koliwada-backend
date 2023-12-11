import { ArrayNotEmpty, IsArray, IsNotEmpty } from "class-validator"

export class CreateRoleDto {
    @IsNotEmpty()
    name: string

    @IsNotEmpty()
    slug: string

    @IsArray()
    @ArrayNotEmpty()
    permissions: string[]
}
