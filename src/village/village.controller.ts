import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { VillageService } from './village.service';
import { CreateVillageDto } from './dto/create-village.dto';
import { UpdateVillageDto } from './dto/update-village.dto';
import { GetAdmin } from 'src/admin/get-admin.decorator';
import { AdminDocument } from 'src/schemas/admin.schema';
import { Village } from 'src/schemas/village.schema';
import { AuthGuard } from '@nestjs/passport';
import { ResponsibilityGuard } from 'src/responsibility/responsibility.guard';
import { Responsibilities } from 'src/responsibility/responsibilities.decorator';
import { CHAIRMAN, SUPER_ADMIN } from 'src/role/roles-list.enum';

@Controller('village')
@Responsibilities(SUPER_ADMIN)
export class VillageController {
  constructor(private readonly villageService: VillageService) { }

  @Post()
  @UseGuards(AuthGuard('admin'), ResponsibilityGuard)
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
  @Responsibilities(CHAIRMAN)
  @UseGuards(AuthGuard(['admin', 'user']), ResponsibilityGuard)
  findByTehsilID(@Param('tehsilID') tehsilID: string) {
    return this.villageService.findByTehsilID(tehsilID);
  }

  @Get(':id')
  @Responsibilities(CHAIRMAN)
  @UseGuards(AuthGuard(['admin', 'user']), ResponsibilityGuard)
  findOne(@Param('id') id: string) {
    return this.villageService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('admin'), ResponsibilityGuard)
  update(@Param('id') id: string, @Body() updateVillageDto: UpdateVillageDto) {
    return this.villageService.update(+id, updateVillageDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('admin'), ResponsibilityGuard)
  remove(@Param('id') id: string) {
    return this.villageService.remove(+id);
  }
}
