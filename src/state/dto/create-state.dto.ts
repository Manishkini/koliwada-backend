import { IsBoolean, IsMongoId, IsNotEmpty, IsOptional } from "class-validator"

export class CreateStateDto {
    @IsNotEmpty()
    name: string

    @IsNotEmpty()
    nameNative: string

    @IsNotEmpty()
    slug: string

    @IsOptional()
    @IsMongoId()
    createdBy: string

    @IsOptional()
    @IsMongoId()
    updatedBy: string

    @IsOptional()
    @IsBoolean()
    active: boolean
}
