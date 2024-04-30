import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Responsibilities } from 'src/responsibility/responsibilities.decorator';
import { SUPER_ADMIN } from 'src/role/roles-list.enum';
import { AuthGuard } from '@nestjs/passport';
import { ResponsibilityGuard } from 'src/responsibility/responsibility.guard';
import { GetAdmin } from 'src/admin/get-admin.decorator';
import { AdminDocument } from 'src/schemas/admin.schema';

@Controller('event')
@Responsibilities(SUPER_ADMIN)
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  @UseGuards(AuthGuard('admin'), ResponsibilityGuard)
  create(
    @GetAdmin() admin: AdminDocument,
    @Body() createEventDto: CreateEventDto
  ) {
    return this.eventService.create(admin, createEventDto);
  }

  @Get()
  @UseGuards(AuthGuard('admin'), ResponsibilityGuard)
  findAll(@GetAdmin() admin: AdminDocument) {
    return this.eventService.findAll(admin);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventService.update(+id, updateEventDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventService.remove(+id);
  }
}
