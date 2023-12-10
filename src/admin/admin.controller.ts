import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Admin } from 'src/schemas/admin.schema';
import { SignInAdminDto } from './dto/sign-in-admin.dto';

@Controller()
export class AdminController {
  constructor(private readonly adminService: AdminService) { }

  @Post('signup')
  signUpAdmin(@Body() createAdminDto: CreateAdminDto): Promise<Admin> {
    return this.adminService.signUpAdmin(createAdminDto);
  }

  @Post('singin')
  signInAdmin(@Body() signInAdminDto: SignInAdminDto): Promise<{ accessToken: string }> {
    return this.adminService.signInAdmin(signInAdminDto);
  }

  @Post()
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.create(createAdminDto);
  }

  @Get()
  findAll() {
    return this.adminService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.update(+id, updateAdminDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminService.remove(+id);
  }
}
