import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Admin } from './admin.schema';
import { State } from './state.schema';

export type DistrictDocument = HydratedDocument<District>;

@Schema({ timestamps: true })
export class District {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    nameNative: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'State', required: true })
    state: State;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Admin' })
    createdBy: Admin;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Admin' })
    updatedBy: Admin;

    @Prop({ type: Boolean })
    active: boolean;
}

export const DistrictSchema = SchemaFactory.createForClass(District);