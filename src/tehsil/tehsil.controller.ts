import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TehsilService } from './tehsil.service';
import { CreateTehsilDto } from './dto/create-tehsil.dto';
import { UpdateTehsilDto } from './dto/update-tehsil.dto';
import { Tehsil } from 'src/schemas/tehsil.schema';
import { GetAdmin } from 'src/admin/get-admin.decorator';
import { AdminDocument } from 'src/schemas/admin.schema';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/role/roles.decorator';
import { CHAIRMAN, SUPER_ADMIN } from 'src/role/roles-list.enum';
import { RolesGuard } from 'src/role/roles.guard';

@Controller('tehsil')
@Roles(SUPER_ADMIN)
export class TehsilController {
  constructor(private readonly tehsilService: TehsilService) { }

  @Post()
  @UseGuards(AuthGuard('admin'), RolesGuard)
  create(
    @Body() createTehsilDto: CreateTehsilDto,
    @GetAdmin() admin: AdminDocument
  ): Promise<Tehsil> {
    return this.tehsilService.create(createTehsilDto, admin);
  }

  @Get()
  @Roles(CHAIRMAN)
  @UseGuards(AuthGuard(['admin', 'user']), RolesGuard)
  findAll() {
    return this.tehsilService.findAll();
  }

  @Get('district/:districtID')
  @Roles(CHAIRMAN)
  @UseGuards(AuthGuard(['admin', 'user']), RolesGuard)
  findByDistrictID(@Param('districtID') districtID: string) {
    return this.tehsilService.findByDistrictID(districtID);
  }

  @Get(':id')
  @Roles(CHAIRMAN)
  @UseGuards(AuthGuard(['admin', 'user']), RolesGuard)
  findOne(@Param('id') id: string) {
    return this.tehsilService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('admin'), RolesGuard)
  update(@Param('id') id: string, @Body() updateTehsilDto: UpdateTehsilDto) {
    return this.tehsilService.update(+id, updateTehsilDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('admin'), RolesGuard)
  remove(@Param('id') id: string) {
    return this.tehsilService.remove(+id);
  }
}
