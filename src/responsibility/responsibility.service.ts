import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateResponsibilityDto } from './dto/create-responsibility.dto';
import { UpdateResponsibilityDto } from './dto/update-responsibility.dto';
import { Responsibility } from 'src/schemas/responsibility.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ResponsibilityService {
  constructor(@InjectModel(Responsibility.name) private responsibilityModal: Model<Responsibility>) { }

  async create(createResponsibilityDto: CreateResponsibilityDto): Promise<Responsibility> {
    try {
      const role = new this.responsibilityModal(createResponsibilityDto)
      await role.save();
      return role;
    } catch (err) {
      throw new InternalServerErrorException(err)
    }
  }

  async findAll(): Promise<Responsibility[]> {
    try {
      const responsibilities = await this.responsibilityModal.find({}).populate('role');
      return responsibilities;
    } catch (err) {
      throw new InternalServerErrorException(err)
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} responsibility`;
  }

  update(id: number, updateResponsibilityDto: UpdateResponsibilityDto) {
    return `This action updates a #${id} responsibility`;
  }

  remove(id: number) {
    return `This action removes a #${id} responsibility`;
  }
}
