import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Admin } from './admin.schema';
import { Village } from './village.schema';
import { Event } from './event.schema';

export type GalleryDocument = HydratedDocument<Gallery>;

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
export class Gallery {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    nameNative: string;

    @Prop({ required: true })
    slug: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true })
    event: Event;

    @Prop({ type: Date })
    eventDate: Date;    

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Village', required: true })
    village: Village;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Admin' })
    createdBy: Admin;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Admin' })
    updatedBy: Admin;

    @Prop({ type: Boolean, default: false })
    isPublished: boolean;

    @Prop({ type: Boolean, default: true })
    active: boolean;
}

export const GallerySchema = SchemaFactory.createForClass(Gallery);