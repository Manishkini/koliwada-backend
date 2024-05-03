import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateTehsilDto } from './dto/create-tehsil.dto';
import { UpdateTehsilDto } from './dto/update-tehsil.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Tehsil } from 'src/schemas/tehsil.schema';
import { Model } from 'mongoose';
import { AdminDocument } from 'src/schemas/admin.schema';

@Injectable()
export class TehsilService {
  constructor(@InjectModel(Tehsil.name) private tehsilModel: Model<Tehsil>) { }

  async create(createTehsilDto: CreateTehsilDto, admin: AdminDocument): Promise<Tehsil> {
    try {
      const tehsil = new this.tehsilModel(createTehsilDto)
      tehsil.createdBy = admin.id
      tehsil.updatedBy = admin.id
      tehsil.active = true
      await tehsil.save();
      return tehsil;
    } catch(error) {
      throw new InternalServerErrorException(error)
    }
  }

  async findAll(): Promise<Tehsil[]> {
    try {
      return await this.tehsilModel.find()
        .populate('district')
        .populate({
          path: 'district',
          populate: {
              path: 'state'
          }
        });
    } catch(error) {
      throw new InternalServerErrorException(error)
    }
  }

  async findByDistrictID(districtID: string): Promise<Tehsil[]> {
    try {
      return await this.tehsilModel.find({ district: districtID })
        .populate('district')
        .populate({
          path: 'district',
          populate: {
              path: 'state'
          }
        });
    } catch(error) {
      throw new InternalServerErrorException(error)
    }
  }

  async findOne(id: string): Promise<Tehsil> {
    try {
      return await this.tehsilModel.findById(id).populate('district');
    } catch(error) {
      throw new InternalServerErrorException(error)
    }
  }

  async update(id: string, admin: AdminDocument, updateTehsilDto: UpdateTehsilDto): Promise<void> {
    try {
      const { name, nameNative, slug } = updateTehsilDto;

      const state = await this.tehsilModel.findById(id);

      if(!state) {
        throw new NotFoundException('State not found');
      }

      await this.tehsilModel.updateOne(
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
      await this.tehsilModel.deleteOne({ _id: id });
    } catch(error) {
      throw new InternalServerErrorException(error)
    }
  }
}
