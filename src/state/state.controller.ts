import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { StateService } from './state.service';
import { CreateStateDto } from './dto/create-state.dto';
import { UpdateStateDto } from './dto/update-state.dto';
import { State } from 'src/schemas/state.schema';
import { AuthGuard } from '@nestjs/passport';
import { AdminDocument } from 'src/schemas/admin.schema';
import { GetAdmin } from 'src/admin/get-admin.decorator';
import { Roles } from 'src/role/roles.decorator';
import { CHAIRMAN, SUPER_ADMIN } from 'src/role/roles-list.enum';
import { RolesGuard } from 'src/role/roles.guard';

@Controller('state')
@Roles(SUPER_ADMIN)
export class StateController {
  constructor(private readonly stateService: StateService) { }

  @Post()
  @UseGuards(AuthGuard('admin'), RolesGuard)
  create(
    @Body() createStateDto: CreateStateDto,
    @GetAdmin() admin: AdminDocument
  ): Promise<State> {
    return this.stateService.create(createStateDto, admin);
  }

  @Get()
  @Roles(CHAIRMAN)
  @UseGuards(AuthGuard(['admin', 'user']), RolesGuard)
  findAll() {
    return this.stateService.findAll();
  }

  @Get(':id')
  @Roles(CHAIRMAN)
  @UseGuards(AuthGuard(['admin', 'user']), RolesGuard)
  findOne(@Param('id') id: string) {
    return this.stateService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('admin'), RolesGuard)
  update(@Param('id') id: string, @Body() updateStateDto: UpdateStateDto) {
    return this.stateService.update(+id, updateStateDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('admin'), RolesGuard)
  remove(@Param('id') id: string) {
    return this.stateService.remove(+id);
  }
}
