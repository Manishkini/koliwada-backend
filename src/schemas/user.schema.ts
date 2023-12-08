import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
    @Prop({ type: String })
    firstName: string;

    @Prop({ type: String })
    middleName: string;

    @Prop({ type: String })
    lastName: string;

    @Prop({
        type: Number,
        min: 10,
        max: 10,
    })
    mobileNumber: number;

    @Prop({ type: String })
    email: string;

    @Prop({ type: String })
    password: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    createdBy: User;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    updatedBy: User;

    @Prop({ type: Boolean })
    active: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);