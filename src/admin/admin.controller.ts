import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
// import { CreateAdminAddressDetails, CreateAdminPersonalDetails } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Admin, AdminDocument } from 'src/schemas/admin.schema';
import { SignInAdminDto } from './dto/sign-in-admin.dto';
import { AdminInvitationDto } from './dto/admin-invitation.dto';
import { CHAIRMAN, SUPER_ADMIN } from 'src/role/roles-list.enum';
import { Roles } from 'src/role/roles.decorator';
import { RolesGuard } from 'src/role/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { CreateAdminPasswordDto } from './dto/create-admin.dto';

@Controller()
export class AdminController {
  constructor(private readonly adminService: AdminService) { }

  // @Post('address-details')
  // @Roles(SUPER_ADMIN, CHAIRMAN)
  // @UseGuards(AuthGuard('admin'), RolesGuard)
  // addressDetails(@Body() createAdminAddressDto: CreateAdminAddressDetails): Promise<Admin> {
  //   return this.adminService.addressDetails(createAdminAddressDto);
  // }

  // @Post('personal-details')
  // @Roles(SUPER_ADMIN, CHAIRMAN)
  // @UseGuards(AuthGuard('admin'), RolesGuard)
  // personalDetails(@Body() createAdminPersonalDto: CreateAdminPersonalDetails): Promise<Admin> {
  //   return this.adminService.personalDetails(createAdminPersonalDto);
  // }

  @Post('singin')
  signInAdmin(@Body() signInAdminDto: SignInAdminDto): Promise<{ accessToken: string }> {
    return this.adminService.signInAdmin(signInAdminDto);
  }

  @Post('invitation')
  @Roles(SUPER_ADMIN, CHAIRMAN)
  @UseGuards(AuthGuard('admin'), RolesGuard)
  adminInvitation(@Body() adminInvitationDto: AdminInvitationDto): Promise<void> {
    return this.adminService.adminInvitation(adminInvitationDto);
  }

  @Get('verify/:partialToken')
  getAdminInitialDetails(@Param('partialToken') partialToken: string): Promise<AdminDocument> {
    return this.adminService.getAdminInitialDetails(partialToken);
  }

  @Post('reset-password')
  adminResetPassword(@Body() createAdminPasswordDto: CreateAdminPasswordDto): Promise<void> {
    return this.adminService.adminResetPassword(createAdminPasswordDto);
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
