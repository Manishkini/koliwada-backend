import { IsBoolean, IsMongoId, IsNotEmpty, IsOptional } from "class-validator"

export class CreateVillageDto {
    @IsNotEmpty()
    name: string

    @IsNotEmpty()
    nameNative: string

    @IsNotEmpty()
    slug: string

    @IsNotEmpty()
    @IsMongoId()
    tehsil: string

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
