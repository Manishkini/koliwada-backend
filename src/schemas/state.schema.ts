import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Admin } from './admin.schema';

export type StateDocument = HydratedDocument<State>;

@Schema({ timestamps: true })
export class State {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    nameNative: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Admin' })
    createdBy: Admin;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Admin' })
    updatedBy: Admin;

    @Prop({ type: Boolean })
    active: boolean;
}

export const StateSchema = SchemaFactory.createForClass(State);