import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateVillageDto } from './dto/create-village.dto';
import { UpdateVillageDto } from './dto/update-village.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Village } from 'src/schemas/village.schema';
import { Model } from 'mongoose';
import { AdminDocument } from 'src/schemas/admin.schema';

@Injectable()
export class VillageService {
  constructor(@InjectModel(Village.name) private villageModel: Model<Village>) { }

  async create(createVillageDto: CreateVillageDto, admin: AdminDocument): Promise<Village> {
    try {
      const village = new this.villageModel(createVillageDto)
      village.createdBy = admin.id
      village.updatedBy = admin.id
      village.active = true
      await village.save();
      return village;
    } catch(error) {
      throw new InternalServerErrorException(error)
    }
  }

  async findAll(): Promise<Village[]> {
    try {
      return await this.villageModel.find({})
        .populate('tehsil')
        .populate('tehsil')
        .populate({
          path: 'tehsil',
          populate: {
            path: 'district',
            populate: {
                path: 'state'
            }
          }
        });
    } catch(error) {
      throw new InternalServerErrorException(error)
    }
  }

  async findByTehsilID(tehsilID: string): Promise<Village[]> {
    try {
      return await this.villageModel.find({ tehsil: tehsilID })
        .populate('tehsil')
        .populate({
          path: 'tehsil',
          populate: {
            path: 'district',
            populate: {
                path: 'state'
            }
          }
        });
    } catch(error) {
      throw new InternalServerErrorException(error)
    }
  }

  async findOne(id: string): Promise<Village> {
    try {
      return await this.villageModel.findById(id).populate('tehsil');
    } catch(error) {
      throw new InternalServerErrorException(error)
    }
  }

  async update(id: string, admin: AdminDocument, updateVillageDto: UpdateVillageDto): Promise<void> {
    try {
      const { name, nameNative, slug } = updateVillageDto;

      const village = await this.villageModel.findById(id);

      if(!village) {
        throw new NotFoundException('Village not found');
      }

      await this.villageModel.updateOne(
        { _id: id },
        {
          $set: {
            name,
            nameNative,
            slug,
            updatedBy: admin.id
          }
        }
      )
    } catch(error) {
      throw new InternalServerErrorException(error)
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.villageModel.deleteOne({ _id: id });
    } catch(error) {
      throw new InternalServerErrorException(error)
    }
  }
}
