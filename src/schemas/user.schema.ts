import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Village } from './village.schema';
import { Admin } from './admin.schema';

export type UserDocument = HydratedDocument<User>;

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
export class User {
    @Prop({ type: String, required: true })
    firstName: string

    @Prop({ type: String, required: true })
    middleName: string

    @Prop({ type: String, required: true })
    lastName: string

    @Prop({ type: String, required: true })
    firstNameNative: string

    @Prop({ type: String, required: true })
    middleNameNative: string

    @Prop({ type: String, required: true })
    lastNameNative: string

    @Prop({ type: String, required: true })
    mobileNumber: string;

    @Prop({ type: String, required: true })
    email: string

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Village' })
    village: Village

    @Prop({ type: String })
    profilePic: string

    @Prop({ type: String })
    highestQualification: string

    @Prop({ type: Number })
    birthDay: number

    @Prop({ type: Number })
    birthMonth: number

    @Prop({ type: Number })
    birthYear: number

    @Prop({ type: String })
    panCard: string

    @Prop({ type: String })
    aadharCard: string

    @Prop({ type: Boolean, default: false })
    isMobileNumberVerified: boolean

    @Prop({ type: Boolean, default: false })
    isEmailVerified: boolean

    @Prop({ type: Boolean, default: false })
    isVillageVerified: boolean

    @Prop({ type: Boolean, default: false })
    isProfilePicVerified: boolean

    @Prop({ type: Boolean, default: false })
    isPanCardVerified: boolean

    @Prop({ type: Boolean, default: false })
    isAadharCardVerified: boolean

    @Prop({ type: Boolean, default: false })
    isApproved: boolean

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Admin' })
    profileApprovedBy: Admin

    @Prop({ type: String, required: true })
    password: string

    @Prop({ type: Boolean, default: true })
    active: boolean
}

export const UserSchema = SchemaFactory.createForClass(User);