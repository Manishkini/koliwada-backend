import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import { UpdateGalleryDto } from './dto/update-gallery.dto';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { ConfigService } from '@nestjs/config';
import { Upload } from '@aws-sdk/lib-storage';
import { AdminDocument } from 'src/schemas/admin.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Gallery } from 'src/schemas/gallery.schema';
import mongoose, { Model } from 'mongoose';
import { Photo } from 'src/schemas/photos.schema';
import { Event } from 'src/schemas/event.schema';
import { v4 as uuidv4 } from 'uuid';

const ObjectId = mongoose.Types.ObjectId;

@Injectable()
export class GalleryService {
  private readonly s3Client = new S3Client({
    credentials: {
      accessKeyId: this.configService.getOrThrow('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.getOrThrow('AWS_SECRET_ACCESS_KEY')
    },
    region: this.configService.getOrThrow('AWS_S3_REGION')
  })

  constructor(
    @InjectModel(Gallery.name) private galleryModel: Model<Gallery>,
    @InjectModel(Photo.name) private photoModel: Model<Photo>,
    @InjectModel(Event.name) private eventModel: Model<Event>,
    private readonly configService: ConfigService
  ) {}

  async create(admin: AdminDocument, files: Array<Express.Multer.File>, createGalleryDto: CreateGalleryDto): Promise<void> {
    try {
      const { event: eventId, eventDate, village } = createGalleryDto;

      const event = await this.eventModel.findById(eventId);
  
      if(!event) {
        throw new NotFoundException('Event not found');
      }
  
      const galleryObject = {
        ...createGalleryDto,
        createdBy: admin.id,
        updatedBy: admin.id,
      }
  
      const gallery = await this.galleryModel.create(galleryObject);
  
      for await(const file of files) {
        const key = `event/${village}/${event.name}/${new Date(eventDate.toString()).getFullYear()}/${uuidv4()}`
        let params = {                 
          Key: key, 
          Bucket: this.configService.getOrThrow('AWS_S3_BUCKET'), 
          Body: file.buffer,
          ContentType: file.mimetype
        };
  
        const parallelUploads3 = new Upload({
          client: this.s3Client,
          params: params,
        });
  
        const response = await parallelUploads3.done();
  
        if (response.$metadata.httpStatusCode === 200) {
          const photo = await this.photoModel.create({
            gallery: gallery._id,
            key: response.Key
          })
        }
      }

    } catch(error) {
      throw new InternalServerErrorException(error)
    }

  }

  async findAll(): Promise<Gallery[]> {
    try {
      const galleries = await this.galleryModel.find({ active: true });
      return galleries;
    } catch(error) {
      throw new InternalServerErrorException(error)
    }
  }

  async findOne(id: string): Promise<Gallery> {
    try {
      const gallery = await this.galleryModel.findById(id);
      return gallery;
    } catch(error) {
      throw new InternalServerErrorException(error)
    }
  }

  update(id: string, updateGalleryDto: UpdateGalleryDto) {
    return `This action updates a #${id} gallery`;
  }

  async remove(id: string): Promise<void> {
    try {
      await this.galleryModel.updateOne({ _id: id }, { $set: { active: false } });
    } catch(error) {
      throw new InternalServerErrorException(error)
    }
  }

  async removeAllPhotos(galleryId: string): Promise<void> {
    try {
      await this.photoModel.deleteMany({ gallery: new ObjectId(galleryId) })
    } catch(error) {
      throw new InternalServerErrorException(error)
    }
  }

  async removeSinglePhoto(galleryId: string, photoId: string): Promise<void> {
    try {
      await this.photoModel.deleteOne({ gallery: new ObjectId(galleryId), _id: new ObjectId(photoId) })
    } catch(error) {
      throw new InternalServerErrorException(error)
    }
  }
}
