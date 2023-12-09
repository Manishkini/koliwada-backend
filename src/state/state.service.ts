import { Injectable } from '@nestjs/common';
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
    const state = new this.stateModel(createStateDto)
    state.createdBy = admin.id
    state.updatedBy = admin.id
    state.active = true
    await state.save();
    return state;
  }

  findAll() {
    return `This action returns all state`;
  }

  findOne(id: number) {
    return `This action returns a #${id} state`;
  }

  update(id: number, updateStateDto: UpdateStateDto) {
    return `This action updates a #${id} state`;
  }

  remove(id: number) {
    return `This action removes a #${id} state`;
  }
}
