import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { StateService } from './state.service';
import { CreateStateDto } from './dto/create-state.dto';
import { UpdateStateDto } from './dto/update-state.dto';
import { State } from 'src/schemas/state.schema';
import { AuthGuard } from '@nestjs/passport';
import { AdminDocument } from 'src/schemas/admin.schema';
import { GetAdmin } from 'src/admin/get-admin.decorator';
import { Responsibilities } from 'src/responsibility/responsibilities.decorator';
import { CHAIRMAN, SUPER_ADMIN } from 'src/role/roles-list.enum';
import { ResponsibilityGuard } from 'src/responsibility/responsibility.guard';

@Controller('state')
@Responsibilities(SUPER_ADMIN)
export class StateController {
  constructor(private readonly stateService: StateService) { }

  @Post()
  @UseGuards(AuthGuard('admin'), ResponsibilityGuard)
  create(
    @Body() createStateDto: CreateStateDto,
    @GetAdmin() admin: AdminDocument
  ): Promise<State> {
    return this.stateService.create(createStateDto, admin);
  }

  @Get()
  @Responsibilities(CHAIRMAN)
  @UseGuards(AuthGuard(['admin', 'user']), ResponsibilityGuard)
  findAll() {
    return this.stateService.findAll();
  }

  @Get(':id')
  @Responsibilities(CHAIRMAN)
  @UseGuards(AuthGuard(['admin', 'user']), ResponsibilityGuard)
  findOne(@Param('id') id: string) {
    return this.stateService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('admin'), ResponsibilityGuard)
  update(@Param('id') id: string, @Body() updateStateDto: UpdateStateDto) {
    return this.stateService.update(+id, updateStateDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('admin'), ResponsibilityGuard)
  remove(@Param('id') id: string) {
    return this.stateService.remove(+id);
  }
}
