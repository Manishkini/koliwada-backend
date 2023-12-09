import { Injectable } from '@nestjs/common';
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
    const district = new this.districtModel(createDistrictDto)
    district.createdBy = admin.id
    district.updatedBy = admin.id
    district.active = true
    await district.save();
    return district;
  }

  findAll() {
    return `This action returns all district`;
  }

  findOne(id: number) {
    return `This action returns a #${id} district`;
  }

  update(id: number, updateDistrictDto: UpdateDistrictDto) {
    return `This action updates a #${id} district`;
  }

  remove(id: number) {
    return `This action removes a #${id} district`;
  }
}
