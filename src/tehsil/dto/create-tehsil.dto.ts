import { IsBoolean, IsMongoId, IsNotEmpty, IsOptional } from "class-validator"

export class CreateTehsilDto {
    @IsNotEmpty()
    name: string

    @IsNotEmpty()
    nameNative: string

    @IsNotEmpty()
    slug: string

    @IsNotEmpty()
    @IsMongoId()
    district: string

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
