import { IsNotEmpty } from "class-validator"

export class CreateEventDto {
    @IsNotEmpty()
    name: string

    @IsNotEmpty()
    nameNative: string

    @IsNotEmpty()
    slug: string
}
