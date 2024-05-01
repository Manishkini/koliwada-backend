import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from 'src/schemas/event.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { AdminDocument } from 'src/schemas/admin.schema';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EventService {

  constructor(@InjectModel(Event.name) private eventModel: Model<Event>) {}

  async create(admin: AdminDocument, createEventDto: CreateEventDto): Promise<Event> {
    const event = new this.eventModel(createEventDto)
    event.createdBy = admin.id
    event.updatedBy = admin.id
    await event.save();
    return event;
  }

  async findAll(admin: AdminDocument): Promise<Event[]> {
    const events = await this.eventModel.find({});
    return events;
  }

  findOne(id: number) {
    return `This action returns a #${id} event`;
  }

  update(id: number, updateEventDto: UpdateEventDto) {
    return `This action updates a #${id} event`;
  }

  remove(id: number) {
    return `This action removes a #${id} event`;
  }
}
