import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Role } from './role.schema';
import { Village } from './village.schema';
import { InvitationStatus } from 'src/admin/invitation-status.enum';
import { State } from './state.schema';
import { District } from './district.schema';
import { Tehsil } from './tehsil.schema';
import { Responsibility } from './responsibility.schema';

export type AdminDocument = HydratedDocument<Admin>;

@Schema({
    timestamps: true,
    toObject: {
        transform: (doc, ret) => {
            delete ret.__v;
            ret.id = ret._id;
            delete ret._id;
        }
    }
})
export class Admin {
    @Prop({ type: String })
    firstName: string;

    @Prop({ type: String })
    middleName: string;

    @Prop({ type: String })
    lastName: string;

    @Prop({ type: String })
    firstNameNative: string;

    @Prop({ type: String })
    middleNameNative: string;

    @Prop({ type: String })
    lastNameNative: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'State', required: true })
    state: State;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'District', required: true })
    district: District;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Tehsil', required: true })
    tehsil: Tehsil;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Village', required: true })
    village: Village;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Responsibility', required: true })
    responsibility: Responsibility;

    @Prop({ type: String, unique: true })
    mobileNumber: string;

    @Prop({ type: String, unique: true })
    email: string;

    @Prop({ type: String })
    password: string;

    @Prop({ type: String })
    panCard: string

    @Prop({ type: String })
    aadharCard: string

    @Prop({ type: Boolean, default: false })
    isPanCardVerified: boolean

    @Prop({ type: Boolean, default: false })
    isAadharCardVerified: boolean

    @Prop({ type: Boolean, default: false })
    isMobileNumberVerified: boolean

    @Prop({ type: Boolean, default: false })
    isEmailVerified: boolean

    @Prop({ type: String, default: InvitationStatus.INVITED })
    invitationStatus: InvitationStatus

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Admin' })
    createdBy: Admin;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Admin' })
    updatedBy: Admin;

    @Prop({ type: Boolean })
    active: boolean;
}

export const AdminSchema = SchemaFactory.createForClass(Admin); 