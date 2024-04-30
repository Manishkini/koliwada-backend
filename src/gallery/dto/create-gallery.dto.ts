import { IsMongoId, IsNotEmpty, IsString } from "class-validator"

export class CreateGalleryDto {
    @IsNotEmpty()
    @IsString()
    name: string

    @IsNotEmpty()
    nameNative: string

    @IsNotEmpty()
    slug: string

    @IsNotEmpty()
    @IsMongoId()
    event: String

    @IsNotEmpty()
    eventDate: String

    @IsNotEmpty()
    @IsMongoId()
    village: string
}
