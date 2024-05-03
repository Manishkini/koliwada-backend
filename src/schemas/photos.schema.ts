import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Gallery } from './gallery.schema';

export type PhotoDocument = HydratedDocument<Photo>;

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
export class Photo {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Gallery', required: true })
    gallery: Gallery;

    @Prop({ required: true })
    key: string;

    @Prop({ required: true })
    width: number;

    @Prop({ required: true })
    height: number;

    @Prop({ type: Boolean, default: true })
    active: boolean;
}

export const PhotoSchema = SchemaFactory.createForClass(Photo);