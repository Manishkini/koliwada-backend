import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { StateService } from './state.service';
import { CreateStateDto } from './dto/create-state.dto';
import { UpdateStateDto } from './dto/update-state.dto';
import { State } from 'src/schemas/state.schema';
import { AuthGuard } from '@nestjs/passport';
import { AdminDocument } from 'src/schemas/admin.schema';
import { GetAdmin } from 'src/auth/get-admin.decorator';

@Controller('state')
@UseGuards(AuthGuard('admin'))
export class StateController {
  constructor(private readonly stateService: StateService) { }

  @Post()
  create(
    @Body() createStateDto: CreateStateDto,
    @GetAdmin() admin: AdminDocument
  ): Promise<State> {
    return this.stateService.create(createStateDto, admin);
  }

  @Get()
  findAll() {
    return this.stateService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stateService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStateDto: UpdateStateDto) {
    return this.stateService.update(+id, updateStateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stateService.remove(+id);
  }
}
