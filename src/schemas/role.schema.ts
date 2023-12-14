import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RoleDocument = HydratedDocument<Role>;

@Schema({ timestamps: true })
export class Role {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    nameNative: string;

    @Prop({ required: true })
    slug: string;

    @Prop({ type: [String] })
    permissions: string[];
}

export const RoleSchema = SchemaFactory.createForClass(Role);