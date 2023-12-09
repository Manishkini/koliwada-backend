import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { DistrictService } from './district.service';
import { CreateDistrictDto } from './dto/create-district.dto';
import { UpdateDistrictDto } from './dto/update-district.dto';
import { District } from 'src/schemas/district.schema';
import { GetAdmin } from 'src/auth/get-admin.decorator';
import { AdminDocument } from 'src/schemas/admin.schema';
import { AuthGuard } from '@nestjs/passport';

@Controller('district')
@UseGuards(AuthGuard('admin'))
export class DistrictController {
  constructor(private readonly districtService: DistrictService) { }

  @Post()
  create(
    @Body() createDistrictDto: CreateDistrictDto,
    @GetAdmin() admin: AdminDocument
  ): Promise<District> {
    return this.districtService.create(createDistrictDto, admin);
  }

  @Get()
  findAll() {
    return this.districtService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.districtService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDistrictDto: UpdateDistrictDto) {
    return this.districtService.update(+id, updateDistrictDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.districtService.remove(+id);
  }
}
