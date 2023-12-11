import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RoleDocument = HydratedDocument<Role>;

@Schema({ timestamps: true })
export class Role {
    @Prop()
    name: string;

    @Prop()
    slug: string;

    @Prop({
        type: [String]
    })
    permissions: string[];
}

export const RoleSchema = SchemaFactory.createForClass(Role);