import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TehsilService } from './tehsil.service';
import { CreateTehsilDto } from './dto/create-tehsil.dto';
import { UpdateTehsilDto } from './dto/update-tehsil.dto';
import { Tehsil } from 'src/schemas/tehsil.schema';
import { GetAdmin } from 'src/admin/get-admin.decorator';
import { AdminDocument } from 'src/schemas/admin.schema';
import { AuthGuard } from '@nestjs/passport';

@Controller('tehsil')
export class TehsilController {
  constructor(private readonly tehsilService: TehsilService) { }

  @Post()
  @UseGuards(AuthGuard('admin'))
  create(
    @Body() createTehsilDto: CreateTehsilDto,
    @GetAdmin() admin: AdminDocument
  ): Promise<Tehsil> {
    return this.tehsilService.create(createTehsilDto, admin);
  }

  @Get()
  @UseGuards(AuthGuard(['admin', 'user']))
  findAll() {
    return this.tehsilService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tehsilService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTehsilDto: UpdateTehsilDto) {
    return this.tehsilService.update(+id, updateTehsilDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tehsilService.remove(+id);
  }
}
