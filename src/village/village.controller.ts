import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { VillageService } from './village.service';
import { CreateVillageDto } from './dto/create-village.dto';
import { UpdateVillageDto } from './dto/update-village.dto';
import { GetAdmin } from 'src/auth/get-admin.decorator';
import { AdminDocument } from 'src/schemas/admin.schema';
import { AuthGuard } from '@nestjs/passport';

@Controller('village')
@UseGuards(AuthGuard('admin'))
export class VillageController {
  constructor(private readonly villageService: VillageService) { }

  @Post()
  create(
    @Body() createVillageDto: CreateVillageDto,
    @GetAdmin() admin: AdminDocument
  ) {
    return this.villageService.create(createVillageDto, admin);
  }

  @Get()
  findAll() {
    return this.villageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.villageService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVillageDto: UpdateVillageDto) {
    return this.villageService.update(+id, updateVillageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.villageService.remove(+id);
  }
}
