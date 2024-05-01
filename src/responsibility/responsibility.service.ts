import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
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

  findOne(id: string) {
    return `This action returns a #${id} responsibility`;
  }

  async update(id: string, updateResponsibilityDto: UpdateResponsibilityDto): Promise<void> {
    const { permissions } = updateResponsibilityDto;
    const responsibility = await this.responsibilityModal.findById(id);

    if(!responsibility) {
      throw new NotFoundException('Responsibility not found');
    }

    await this.responsibilityModal.updateOne({
      _id: responsibility._id
    }, {
      $set: {
        permissions
      }
    })

  }

  remove(id: string) {
    return `This action removes a #${id} responsibility`;
  }
}
