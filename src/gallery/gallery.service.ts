import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import { UpdateGalleryDto } from './dto/update-gallery.dto';
import { DeleteObjectCommand, GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { ConfigService } from '@nestjs/config';
import { Upload } from '@aws-sdk/lib-storage';
import { AdminDocument } from 'src/schemas/admin.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Gallery } from 'src/schemas/gallery.schema';
import { Photo } from 'src/schemas/photos.schema';
import { Event } from 'src/schemas/event.schema';
import { Village } from 'src/schemas/village.schema';
import { v4 as uuidv4 } from 'uuid';
import * as sharp from 'sharp';
import { AdminPayload } from 'src/admin/admin-payload.interface';

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
    @InjectModel(Village.name) private villageModel: Model<Village>,
    private readonly configService: ConfigService
  ) {}

  async create(admin: AdminDocument, files: Array<Express.Multer.File>, createGalleryDto: CreateGalleryDto): Promise<void> {
    try {
      const { event: eventId, eventDate, village: villageId } = createGalleryDto;

      const event = await this.eventModel.findById(eventId);
  
      if(!event) {
        throw new NotFoundException('Event not found');
      }

      const village = await this.villageModel.findById(villageId);
  
      if(!village) {
        throw new NotFoundException('Village not found');
      }
  
      const galleryObject = {
        ...createGalleryDto,
        createdBy: admin.id,
        updatedBy: admin.id,
      }
  
      const gallery = await this.galleryModel.create(galleryObject);
  
      for await(const file of files) {
        const sharpResponse = await sharp(file.buffer).metadata();
        const key = `event/${villageId}/${event.name}/${new Date(eventDate.toString()).getFullYear()}/${uuidv4()}`
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
          await this.photoModel.create({
            gallery: gallery._id,
            key: response.Key,
            width: sharpResponse.width,
            height: sharpResponse.height,
          })
        }
      }

    } catch(error) {
      throw new InternalServerErrorException(error)
    }

  }

  async findAll(admin: AdminPayload): Promise<Gallery[]> {
    try {
      const query = { active: true }
      if(admin.role !== 'super_admin' && admin.role !== 'admin') {
        query['village'] = admin.villageID
      }

      const galleries = await this.galleryModel.find(query).populate(['event', 'village']);
      return galleries;
    } catch(error) {
      throw new InternalServerErrorException(error)
    }
  }

  async findAllPhotos(id: string): Promise<Photo[]> {
    try {
      const tempPhotos = await this.photoModel.find({ gallery: new ObjectId(id) });
      const photos = JSON.parse(JSON.stringify(tempPhotos))
      for await(const photo of photos) {
        const params = {
          Bucket: this.configService.getOrThrow('AWS_S3_BUCKET'),
          Key: photo.key
        };

        const command = new GetObjectCommand(params);
        let src = await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });

        photo.src = src
      }

      return photos;
    } catch(error) {
      console.log('error', error)
      throw new InternalServerErrorException(error)
    }
  }

  async findOne(id: string, admin: AdminPayload): Promise<Gallery> {
    try {
      const query = { _id: id, active: true }
      if(admin.role !== 'super_admin' && admin.role !== 'admin') {
        query['village'] = admin.villageID
      }
      const gallery = await this.galleryModel.findOne(query).populate(['event', 'village']);
      return gallery;
    } catch(error) {
      throw new InternalServerErrorException(error)
    }
  }

  async update(id: string, admin: AdminDocument, files: Array<Express.Multer.File>, updateGalleryDto: UpdateGalleryDto): Promise<void> {
    try {
      const { name, nameNative, event: eventId, eventDate, village: villageId } = updateGalleryDto;

      const gallery = await this.galleryModel.findById(id);

      if(!gallery) {
        throw new NotFoundException('Event not found');
      }

      const event = await this.eventModel.findById(eventId);
  
      if(!event) {
        throw new NotFoundException('Event not found');
      }

      const village = await this.villageModel.findById(villageId);

      if(!village) {
        throw new NotFoundException('Village not found');
      }

      await this.galleryModel.updateOne(
        { _id: id },
        { $set: { name, nameNative, event: eventId, eventDate, village: villageId, updatedBy: admin.id } }
      )

      if(files?.length) {
        for await(const file of files) {
          const sharpResponse = await sharp(file.buffer).metadata();
          console.log('sharpResponse', sharpResponse)
          const key = `event/${village.id}/${event.name}/${new Date(eventDate.toString()).getFullYear()}/${uuidv4()}`
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
            await this.photoModel.create({
              gallery: gallery._id,
              key: response.Key,
              width: sharpResponse.width,
              height: sharpResponse.height,
            })
          }
        }
      }

    } catch(error) {
      console.log('error', error)
      throw new InternalServerErrorException(error)
    }
  }

  async updateStatus(id: string, admin: AdminDocument, status: string) {
    try {

      if(!id || !status || (status !== 'publish' && status !== 'unpublish')) {
        throw new BadRequestException("id, status is required, make sure to send status as 'publish or 'unpublish'")
      }

      const gallery = await this.galleryModel.findById(id);

      if(!gallery) {
        throw new NotFoundException('Event not found');
      }

      await this.galleryModel.updateOne(
        { _id: id }, 
        { $set: { updatedBy: admin.id, isPublished: status === "publish" ? true : false } }
      );
    } catch(error) {
      throw new InternalServerErrorException(error)
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.galleryModel.updateOne({ _id: id }, { $set: { active: false } });
      await this.photoModel.updateMany({ gallery: id }, { $set: { active: false } });
    } catch(error) {
      throw new InternalServerErrorException(error)
    }
  }

  async removeAllPhotos(galleryId: string): Promise<void> {
    try {
      const gallery = await this.galleryModel.findById(galleryId);

      if(!gallery) {
        throw new NotFoundException('Gallery not found');
      }

      const photos = await this.photoModel.find({ gallery: new ObjectId(galleryId) });
      for await(const photo of photos) {
        let params = {                 
          Key: photo.key, 
          Bucket: this.configService.getOrThrow('AWS_S3_BUCKET'),
        };
  
        const command = new DeleteObjectCommand(params);
        await this.s3Client.send(command);
      }
      await this.photoModel.deleteMany({ gallery: new ObjectId(galleryId) })
    } catch(error) {
      throw new InternalServerErrorException(error)
    }
  }

  async removeSinglePhoto(galleryId: string, photoId: string): Promise<void> {
    try {
      const gallery = await this.galleryModel.findById(galleryId);

      if(!gallery) {
        throw new NotFoundException('Gallery not found');
      }

      const photo = await this.photoModel.findById(photoId);

      if(!photo) {
        throw new NotFoundException('Event not found');
      }

      let params = {                 
        Key: photo.key, 
        Bucket: this.configService.getOrThrow('AWS_S3_BUCKET'),
      };

      const command = new DeleteObjectCommand(params);
      await this.s3Client.send(command);

      await this.photoModel.deleteOne({ gallery: new ObjectId(galleryId), _id: new ObjectId(photoId) });
    } catch(error) {
      throw new InternalServerErrorException(error)
    }
  }
}
