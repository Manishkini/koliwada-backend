import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Role } from './role.schema';

export type AdminDocument = HydratedDocument<Admin>;

@Schema({ timestamps: true })
export class Admin {
    @Prop({ type: String })
    firstName: string;

    @Prop({ type: String })
    middleName: string;

    @Prop({ type: String })
    lastName: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Role' })
    role: Role;

    @Prop({
        type: Number
    })
    mobileNumber: number;

    @Prop({ type: String })
    email: string;

    @Prop({ type: String })
    password: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Admin' })
    createdBy: Admin;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Admin' })
    updatedBy: Admin;

    @Prop({ type: Boolean })
    active: boolean;
}

export const AdminSchema = SchemaFactory.createForClass(Admin); 