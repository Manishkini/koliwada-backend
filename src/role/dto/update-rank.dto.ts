import { Type } from "class-transformer"
import { IsArray, IsMongoId, IsNotEmpty, IsNumber, ValidateNested } from "class-validator"

class RankObj {
    @IsNotEmpty()
    @IsMongoId()
    id: string

    @IsNotEmpty()
    @IsNumber()
    rank: number
}

export class UpdateRankDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => RankObj)
    roles: RankObj[]
}
