import { IsBoolean, IsMongoId, IsNotEmpty, IsOptional } from "class-validator"

export class CreateStateDto {
    @IsNotEmpty()
    name: string

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
