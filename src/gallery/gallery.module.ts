import { Module } from '@nestjs/common';
import { GalleryService } from './gallery.service';
import { GalleryController } from './gallery.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Gallery, GallerySchema } from 'src/schemas/gallery.schema';
import { Photo, PhotoSchema } from 'src/schemas/photos.schema';
import { Event, EventSchema } from 'src/schemas/event.schema';
import { Village, VillageSchema } from 'src/schemas/village.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Gallery.name, schema: GallerySchema }]),
    MongooseModule.forFeature([{ name: Photo.name, schema: PhotoSchema }]),
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
    MongooseModule.forFeature([{ name: Village.name, schema: VillageSchema }]),
  ],
  controllers: [GalleryController],
  providers: [GalleryService],
})
export class GalleryModule {}
