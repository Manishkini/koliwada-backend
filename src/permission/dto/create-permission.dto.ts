import { ArrayNotEmpty, IsArray, IsNotEmpty } from "class-validator"

export class CreatePermissionDto {
    @IsNotEmpty()
    name: string

    @IsArray()
    @ArrayNotEmpty()
    permissions: string[]
}
