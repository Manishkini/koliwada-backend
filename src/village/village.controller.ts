import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { VillageService } from './village.service';
import { CreateVillageDto } from './dto/create-village.dto';
import { UpdateVillageDto } from './dto/update-village.dto';
import { GetAdmin } from 'src/admin/get-admin.decorator';
import { AdminDocument } from 'src/schemas/admin.schema';
import { Village } from 'src/schemas/village.schema';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/role/roles.guard';
import { Roles } from 'src/role/roles.decorator';
import { CHAIRMAN, SUPER_ADMIN } from 'src/role/roles-list.enum';

@Controller('village')
@Roles(SUPER_ADMIN)
export class VillageController {
  constructor(private readonly villageService: VillageService) { }

  @Post()
  @UseGuards(AuthGuard('admin'), RolesGuard)
  create(
    @Body() createVillageDto: CreateVillageDto,
    @GetAdmin() admin: AdminDocument
  ) {
    return this.villageService.create(createVillageDto, admin);
  }

  @Get()
  findAll(): Promise<Village[]> {
    return this.villageService.findAll();
  }

  @Get('tehsil/:tehsilID')
  @Roles(CHAIRMAN)
  @UseGuards(AuthGuard(['admin', 'user']), RolesGuard)
  findByTehsilID(@Param('tehsilID') tehsilID: string) {
    return this.villageService.findByTehsilID(tehsilID);
  }

  @Get(':id')
  @Roles(CHAIRMAN)
  @UseGuards(AuthGuard(['admin', 'user']), RolesGuard)
  findOne(@Param('id') id: string) {
    return this.villageService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('admin'), RolesGuard)
  update(@Param('id') id: string, @Body() updateVillageDto: UpdateVillageDto) {
    return this.villageService.update(+id, updateVillageDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('admin'), RolesGuard)
  remove(@Param('id') id: string) {
    return this.villageService.remove(+id);
  }
}
