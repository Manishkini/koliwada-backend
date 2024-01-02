import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { DistrictService } from './district.service';
import { CreateDistrictDto } from './dto/create-district.dto';
import { UpdateDistrictDto } from './dto/update-district.dto';
import { District } from 'src/schemas/district.schema';
import { GetAdmin } from 'src/admin/get-admin.decorator';
import { AdminDocument } from 'src/schemas/admin.schema';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/role/roles.decorator';
import { CHAIRMAN, SUPER_ADMIN } from 'src/role/roles-list.enum';
import { RolesGuard } from 'src/role/roles.guard';

@Controller('district')
@Roles(SUPER_ADMIN)
export class DistrictController {
  constructor(private readonly districtService: DistrictService) { }

  @Post()
  @UseGuards(AuthGuard('admin'), RolesGuard)
  create(
    @Body() createDistrictDto: CreateDistrictDto,
    @GetAdmin() admin: AdminDocument
  ): Promise<District> {
    return this.districtService.create(createDistrictDto, admin);
  }

  @Get()
  @Roles(CHAIRMAN)
  @UseGuards(AuthGuard(['admin', 'user']), RolesGuard)
  findAll() {
    return this.districtService.findAll();
  }

  @Get('state/:stateID')
  @Roles(CHAIRMAN)
  @UseGuards(AuthGuard(['admin', 'user']), RolesGuard)
  findByStateID(@Param('stateID') stateID: string) {
    return this.districtService.findByStateID(stateID);
  }

  @Get(':id')
  @Roles(CHAIRMAN)
  @UseGuards(AuthGuard(['admin', 'user']), RolesGuard)
  findOne(@Param('id') id: string) {
    return this.districtService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('admin'), RolesGuard)
  update(@Param('id') id: string, @Body() updateDistrictDto: UpdateDistrictDto) {
    return this.districtService.update(+id, updateDistrictDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('admin'), RolesGuard)
  remove(@Param('id') id: string) {
    return this.districtService.remove(+id);
  }
}
