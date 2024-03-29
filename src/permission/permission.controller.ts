import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Permission } from 'src/schemas/permission.schema';
import { AuthGuard } from '@nestjs/passport';
import { SUPER_ADMIN } from 'src/role/roles-list.enum';
import { ResponsibilityGuard } from 'src/responsibility/responsibility.guard';
import { Responsibilities } from 'src/responsibility/responsibilities.decorator';

@Controller('permission')
@Responsibilities(SUPER_ADMIN)
@UseGuards(AuthGuard('admin'), ResponsibilityGuard)
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) { }

  @Post()
  create(@Body() createPermissionDto: CreatePermissionDto): Promise<Permission> {
    return this.permissionService.create(createPermissionDto);
  }

  @Get()
  findAll(): Promise<Permission[]> {
    return this.permissionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.permissionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionDto) {
    return this.permissionService.update(+id, updatePermissionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.permissionService.remove(id);
  }
}
