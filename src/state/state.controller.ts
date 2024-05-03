import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { StateService } from './state.service';
import { CreateStateDto } from './dto/create-state.dto';
import { UpdateStateDto } from './dto/update-state.dto';
import { State } from 'src/schemas/state.schema';
import { AuthGuard } from '@nestjs/passport';
import { AdminDocument } from 'src/schemas/admin.schema';
import { GetAdmin } from 'src/admin/get-admin.decorator';
import { Responsibilities } from 'src/responsibility/responsibilities.decorator';
import { ADMIN, CHAIRMAN, SUPER_ADMIN } from 'src/role/roles-list.enum';
import { ResponsibilityGuard } from 'src/responsibility/responsibility.guard';

@Controller('state')
export class StateController {
  constructor(private readonly stateService: StateService) { }

  @Post()
  @UseGuards(AuthGuard('admin'), ResponsibilityGuard)
  @Responsibilities(SUPER_ADMIN, ADMIN)
  create(
    @Body() createStateDto: CreateStateDto,
    @GetAdmin() admin: AdminDocument
  ): Promise<State> {
    return this.stateService.create(createStateDto, admin);
  }

  @Get()
  @UseGuards(AuthGuard(['admin', 'user']), ResponsibilityGuard)
  @Responsibilities(SUPER_ADMIN, ADMIN, CHAIRMAN)
  findAll(): Promise<State[]> {
    return this.stateService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard(['admin', 'user']), ResponsibilityGuard)
  @Responsibilities(SUPER_ADMIN, ADMIN, CHAIRMAN)
  findOne(@Param('id') id: string): Promise<State> {
    return this.stateService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('admin'), ResponsibilityGuard)
  @Responsibilities(SUPER_ADMIN, ADMIN)
  update(@Param('id') id: string, @GetAdmin() admin: AdminDocument, @Body() updateStateDto: UpdateStateDto): Promise<void> {
    return this.stateService.update(id, admin, updateStateDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('admin'), ResponsibilityGuard)
  @Responsibilities(SUPER_ADMIN, ADMIN)
  remove(@Param('id') id: string): Promise<void> {
    return this.stateService.remove(id);
  }
}
