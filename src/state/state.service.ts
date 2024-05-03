import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateStateDto } from './dto/create-state.dto';
import { UpdateStateDto } from './dto/update-state.dto';
import { State } from 'src/schemas/state.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AdminDocument } from 'src/schemas/admin.schema';

@Injectable()
export class StateService {
  constructor(@InjectModel(State.name) private stateModel: Model<State>) { }

  async create(createStateDto: CreateStateDto, admin: AdminDocument): Promise<State> {
    try {
      const state = new this.stateModel(createStateDto)
      state.createdBy = admin.id
      state.updatedBy = admin.id
      state.active = true
      await state.save();
      return state;
    } catch(error) {
      throw new InternalServerErrorException(error)
    }
  }

  async findAll(): Promise<State[]> {
    try {
      return await this.stateModel.find({});
    } catch(error) {
      throw new InternalServerErrorException(error)
    }
  }

  async findOne(id: string): Promise<State> {
    try {
      return await this.stateModel.findById(id);
    } catch(error) {
      throw new InternalServerErrorException(error)
    }
  }

  async update(id: string, admin: AdminDocument, updateStateDto: UpdateStateDto): Promise<void> {
    try {
      const { name, nameNative, slug } = updateStateDto;

      const state = await this.stateModel.findById(id);

      if(!state) {
        throw new NotFoundException('State not found');
      }

      await this.stateModel.updateOne(
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
      await this.stateModel.deleteOne({ _id: id });
    } catch(error) {
      throw new InternalServerErrorException(error)
    }
  }
}
