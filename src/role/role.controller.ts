import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from 'src/schemas/role.schema';
import { AuthGuard } from '@nestjs/passport';
import { Responsibilities } from 'src/responsibility/responsibilities.decorator';
import { ResponsibilityGuard } from 'src/responsibility/responsibility.guard';
import { SUPER_ADMIN } from './roles-list.enum';
import { UpdateRankDto } from './dto/update-rank.dto';

@Controller('role')
@UseGuards(AuthGuard('admin'))
export class RoleController {
  constructor(private readonly roleService: RoleService) { }

  @Post()
  @Responsibilities(SUPER_ADMIN)
  @UseGuards(ResponsibilityGuard)
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @Patch('rank')
  @HttpCode(200)
  @Responsibilities(SUPER_ADMIN)
  @UseGuards(ResponsibilityGuard)
  updateRank(@Body() updateRankDto: UpdateRankDto): Promise<void> {
    return this.roleService.updateRank(updateRankDto);
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
  @HttpCode(200)
  @Responsibilities(SUPER_ADMIN)
  @UseGuards(AuthGuard('admin'), ResponsibilityGuard)
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(id, updateRoleDto);
  }

  @Delete(':id')
  @Responsibilities(SUPER_ADMIN)
  @UseGuards(AuthGuard('admin'), ResponsibilityGuard)
  remove(@Param('id') id: string) {
    return this.roleService.remove(id);
  }
}
