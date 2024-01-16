import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Admin } from './admin.schema';
import { Role } from './role.schema';

export type ResponsibilityDocument = HydratedDocument<Responsibility>;

@Schema({
    timestamps: true,
    toJSON: {
        transform: (doc, ret) => {
            delete ret.__v;
            ret.id = ret._id;
            delete ret._id;
        }
    }
})
export class Responsibility {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Role' })
    role: Role;

    @Prop({ type: [Object] })
    permissions: Object[];

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Admin' })
    createdBy: Admin;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Admin' })
    updatedBy: Admin;

    @Prop({ type: Boolean })
    active: boolean;
}

export const ResponsibilitySchema = SchemaFactory.createForClass(Responsibility);