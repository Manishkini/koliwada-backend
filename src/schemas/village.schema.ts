import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Admin } from './admin.schema';
import { Tehsil } from './tehsil.schema';

export type VillageDocument = HydratedDocument<Village>;

@Schema({ timestamps: true })
export class Village {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    nameNative: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Tehsil', required: true })
    tehsil: Tehsil;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Admin' })
    createdBy: Admin;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Admin' })
    updatedBy: Admin;

    @Prop({ type: Boolean })
    active: boolean;
}

export const VillageSchema = SchemaFactory.createForClass(Village);