import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ResponsibilityService } from './responsibility.service';
import { CreateResponsibilityDto } from './dto/create-responsibility.dto';
import { UpdateResponsibilityDto } from './dto/update-responsibility.dto';
import { Responsibility } from 'src/schemas/responsibility.schema';
import { AuthGuard } from '@nestjs/passport';
import { Responsibilities } from 'src/responsibility/responsibilities.decorator';
import { SUPER_ADMIN } from 'src/role/roles-list.enum';
import { ResponsibilityGuard } from 'src/responsibility/responsibility.guard';

@Controller('responsibility')
@UseGuards(AuthGuard('admin'))
export class ResponsibilityController {
  constructor(private readonly responsibilityService: ResponsibilityService) { }

  @Post()
  @Responsibilities(SUPER_ADMIN)
  @UseGuards(ResponsibilityGuard)
  create(@Body() createResponsibilityDto: CreateResponsibilityDto): Promise<Responsibility> {
    return this.responsibilityService.create(createResponsibilityDto);
  }

  @Get()
  findAll(): Promise<Responsibility[]> {
    return this.responsibilityService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.responsibilityService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateResponsibilityDto: UpdateResponsibilityDto) {
    return this.responsibilityService.update(+id, updateResponsibilityDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.responsibilityService.remove(+id);
  }
}
