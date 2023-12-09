import { IsBoolean, IsMongoId, IsNotEmpty, IsOptional } from "class-validator"

export class CreateDistrictDto {
    @IsNotEmpty()
    name: string

    @IsNotEmpty()
    @IsMongoId()
    state: string

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
