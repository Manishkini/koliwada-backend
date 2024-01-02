import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from 'src/schemas/role.schema';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from './roles.decorator';
import { RolesGuard } from './roles.guard';
import { SUPER_ADMIN } from './roles-list.enum';

@Controller('role')
@UseGuards(AuthGuard('admin'))
export class RoleController {
  constructor(private readonly roleService: RoleService) { }

  @Post()
  @Roles(SUPER_ADMIN)
  @UseGuards(RolesGuard)
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @Get()
  findAll(): Promise<Role[]> {
    return this.roleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(id);
  }

  @Patch(':id')
  @Roles(SUPER_ADMIN)
  @UseGuards(AuthGuard('admin'), RolesGuard)
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(id, updateRoleDto);
  }

  @Delete(':id')
  @Roles(SUPER_ADMIN)
  @UseGuards(AuthGuard('admin'), RolesGuard)
  remove(@Param('id') id: string) {
    return this.roleService.remove(id);
  }
}
