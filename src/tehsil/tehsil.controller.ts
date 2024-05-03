import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TehsilService } from './tehsil.service';
import { CreateTehsilDto } from './dto/create-tehsil.dto';
import { UpdateTehsilDto } from './dto/update-tehsil.dto';
import { Tehsil } from 'src/schemas/tehsil.schema';
import { GetAdmin } from 'src/admin/get-admin.decorator';
import { AdminDocument } from 'src/schemas/admin.schema';
import { AuthGuard } from '@nestjs/passport';
import { Responsibilities } from 'src/responsibility/responsibilities.decorator';
import { ADMIN, CHAIRMAN, SUPER_ADMIN } from 'src/role/roles-list.enum';
import { ResponsibilityGuard } from 'src/responsibility/responsibility.guard';

@Controller('tehsil')
export class TehsilController {
  constructor(private readonly tehsilService: TehsilService) { }

  @Post()
  @UseGuards(AuthGuard('admin'), ResponsibilityGuard)
  @Responsibilities(SUPER_ADMIN, ADMIN)
  create(
    @Body() createTehsilDto: CreateTehsilDto,
    @GetAdmin() admin: AdminDocument
  ): Promise<Tehsil> {
    return this.tehsilService.create(createTehsilDto, admin);
  }

  @Get()
  @UseGuards(AuthGuard(['admin', 'user']), ResponsibilityGuard)
  @Responsibilities(SUPER_ADMIN, ADMIN, CHAIRMAN)
  findAll() {
    return this.tehsilService.findAll();
  }

  @Get('district/:districtID')
  @UseGuards(AuthGuard(['admin', 'user']), ResponsibilityGuard)
  @Responsibilities(SUPER_ADMIN, ADMIN, CHAIRMAN)
  findByDistrictID(@Param('districtID') districtID: string) {
    return this.tehsilService.findByDistrictID(districtID);
  }

  @Get(':id')
  @UseGuards(AuthGuard(['admin', 'user']), ResponsibilityGuard)
  @Responsibilities(SUPER_ADMIN, ADMIN, CHAIRMAN)
  findOne(@Param('id') id: string) {
    return this.tehsilService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('admin'), ResponsibilityGuard)
  @Responsibilities(SUPER_ADMIN, ADMIN)
  update(@Param('id') id: string, @GetAdmin() admin: AdminDocument, @Body() updateTehsilDto: UpdateTehsilDto) {
    return this.tehsilService.update(id, admin, updateTehsilDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('admin'), ResponsibilityGuard)
  @Responsibilities(SUPER_ADMIN, ADMIN)
  remove(@Param('id') id: string) {
    return this.tehsilService.remove(id);
  }
}
