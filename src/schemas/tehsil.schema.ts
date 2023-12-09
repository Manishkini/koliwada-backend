import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Admin } from './admin.schema';
import { District } from './district.schema';

export type TehsilDocument = HydratedDocument<Tehsil>;

@Schema({ timestamps: true })
export class Tehsil {
    @Prop({
        required: true
    })
    name: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'District', required: true })
    district: District;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Admin' })
    createdBy: Admin;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Admin' })
    updatedBy: Admin;

    @Prop({ type: Boolean })
    active: boolean;
}

export const TehsilSchema = SchemaFactory.createForClass(Tehsil);