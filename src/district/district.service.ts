import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateDistrictDto } from './dto/create-district.dto';
import { UpdateDistrictDto } from './dto/update-district.dto';
import { InjectModel } from '@nestjs/mongoose';
import { District } from 'src/schemas/district.schema';
import { Model } from 'mongoose';
import { AdminDocument } from 'src/schemas/admin.schema';

@Injectable()
export class DistrictService {
  constructor(@InjectModel(District.name) private districtModel: Model<District>) { }

  async create(createDistrictDto: CreateDistrictDto, admin: AdminDocument): Promise<District> {
    try {
      const district = new this.districtModel(createDistrictDto)
      district.createdBy = admin.id
      district.updatedBy = admin.id
      district.active = true
      await district.save();
      return district;
    } catch(error) {
      throw new InternalServerErrorException(error)
    }
  }

  async findAll(): Promise<District[]> {
    try {
      return this.districtModel.find({}).populate('state');
    } catch(error) {
      throw new InternalServerErrorException(error)
    }
  }

  async findByStateID(stateID: string): Promise<District[]> {
    try {
      return await this.districtModel.find({ state: stateID }).populate('state');
    } catch(error) {
      throw new InternalServerErrorException(error)
    }
  }

  async findOne(id: string): Promise<District> {
    try {
      return await this.districtModel.findById(id).populate('state');
    } catch(error) {
      throw new InternalServerErrorException(error)
    }
  }

  async update(id: string, admin: AdminDocument, updateDistrictDto: UpdateDistrictDto): Promise<void> {
    try {
      const { name, nameNative, slug } = updateDistrictDto;

      const state = await this.districtModel.findById(id);

      if(!state) {
        throw new NotFoundException('State not found');
      }

      await this.districtModel.updateOne(
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
      await this.districtModel.deleteOne({ _id: id });
    } catch(error) {
      throw new InternalServerErrorException(error)
    }
  }
}
