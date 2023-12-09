import { Injectable } from '@nestjs/common';
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
    const tehsil = new this.tehsilModel(createTehsilDto)
    tehsil.createdBy = admin.id
    tehsil.updatedBy = admin.id
    tehsil.active = true
    await tehsil.save();
    return tehsil;
  }

  findAll() {
    return `This action returns all tehsil`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tehsil`;
  }

  update(id: number, updateTehsilDto: UpdateTehsilDto) {
    return `This action updates a #${id} tehsil`;
  }

  remove(id: number) {
    return `This action removes a #${id} tehsil`;
  }
}
