import { IsMongoId, IsNumber, IsOptional, IsString, ValidateIf } from "class-validator"
import { InvitationStatus } from "../invitation-status.enum"

export class FilterAdminDto {
    @IsOptional()
    @IsString()
    searchString: string

    @ValidateIf((e) => e.responsibility !== '')
    @IsMongoId()
    @IsOptional()
    responsibility: string

    @ValidateIf((e) => e.state !== '')
    @IsOptional()
    @IsMongoId()
    state: string

    @ValidateIf((e) => e.district !== '')
    @IsOptional()
    @IsMongoId()
    district: string

    @ValidateIf((e) => e.tehsil !== '')
    @IsOptional()
    @IsMongoId()
    tehsil: string

    @ValidateIf((e) => e.village !== '')
    @IsOptional()
    @IsMongoId()
    village: string

    @IsOptional()
    @IsString()
    invitationStatus: InvitationStatus

    @IsOptional()
    @IsNumber()
    limit: number

    @IsOptional()
    @IsNumber()
    skip: number
}