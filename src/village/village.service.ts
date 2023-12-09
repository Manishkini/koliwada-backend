import { Injectable } from '@nestjs/common';
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
    const village = new this.villageModel(createVillageDto)
    village.createdBy = admin.id
    village.updatedBy = admin.id
    village.active = true
    await village.save();
    return village;
  }

  findAll() {
    return `This action returns all village`;
  }

  findOne(id: number) {
    return `This action returns a #${id} village`;
  }

  update(id: number, updateVillageDto: UpdateVillageDto) {
    return `This action updates a #${id} village`;
  }

  remove(id: number) {
    return `This action removes a #${id} village`;
  }
}
