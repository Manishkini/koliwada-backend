import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { DistrictService } from './district.service';
import { CreateDistrictDto } from './dto/create-district.dto';
import { UpdateDistrictDto } from './dto/update-district.dto';
import { District } from 'src/schemas/district.schema';
import { GetAdmin } from 'src/admin/get-admin.decorator';
import { AdminDocument } from 'src/schemas/admin.schema';
import { AuthGuard } from '@nestjs/passport';
import { Responsibilities } from 'src/responsibility/responsibilities.decorator';
import { ADMIN, CHAIRMAN, SUPER_ADMIN } from 'src/role/roles-list.enum';
import { ResponsibilityGuard } from 'src/responsibility/responsibility.guard';

@Controller('district')
export class DistrictController {
  constructor(private readonly districtService: DistrictService) { }

  @Post()
  @UseGuards(AuthGuard('admin'), ResponsibilityGuard)
  @Responsibilities(SUPER_ADMIN, ADMIN)
  create(
    @Body() createDistrictDto: CreateDistrictDto,
    @GetAdmin() admin: AdminDocument
  ): Promise<District> {
    return this.districtService.create(createDistrictDto, admin);
  }

  @Get()
  @UseGuards(AuthGuard(['admin', 'user']), ResponsibilityGuard)
  @Responsibilities(SUPER_ADMIN, ADMIN, CHAIRMAN)
  findAll() {
    return this.districtService.findAll();
  }

  @Get('state/:stateID')
  @UseGuards(AuthGuard(['admin', 'user']), ResponsibilityGuard)
  @Responsibilities(SUPER_ADMIN, ADMIN, CHAIRMAN)
  findByStateID(@Param('stateID') stateID: string) {
    return this.districtService.findByStateID(stateID);
  }

  @Get(':id')
  @UseGuards(AuthGuard(['admin', 'user']), ResponsibilityGuard)
  @Responsibilities(SUPER_ADMIN, ADMIN, CHAIRMAN)
  findOne(@Param('id') id: string) {
    return this.districtService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('admin'), ResponsibilityGuard)
  @Responsibilities(SUPER_ADMIN, ADMIN)
  update(@Param('id') id: string, @GetAdmin() admin: AdminDocument, @Body() updateDistrictDto: UpdateDistrictDto) {
    return this.districtService.update(id, admin, updateDistrictDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('admin'), ResponsibilityGuard)
  @Responsibilities(SUPER_ADMIN, ADMIN)
  remove(@Param('id') id: string) {
    return this.districtService.remove(id);
  }
}
