import { IsArray, IsMongoId, IsNotEmpty } from "class-validator";
import mongoose from "mongoose";

export class CreateResponsibilityDto {
    @IsNotEmpty()
    @IsMongoId()
    role: mongoose.Schema.Types.ObjectId

    @IsArray()
    permissions: object[]
}
