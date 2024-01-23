import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode } from '@nestjs/common';
import { AdminService } from './admin.service';
// import { CreateAdminAddressDetails, CreateAdminPersonalDetails } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Admin, AdminDocument } from 'src/schemas/admin.schema';
import { SignInAdminDto } from './dto/sign-in-admin.dto';
import { AdminInvitationDto } from './dto/admin-invitation.dto';
import { CHAIRMAN, SUPER_ADMIN, VICE_PRESIDENT } from 'src/role/roles-list.enum';
import { Responsibilities } from 'src/responsibility/responsibilities.decorator';
import { ResponsibilityGuard } from 'src/responsibility/responsibility.guard';
import { AuthGuard } from '@nestjs/passport';
import { CreateAdminPasswordDto } from './dto/create-admin.dto';
import { GetAdmin } from './get-admin.decorator';
import { AdminPayload } from './admin-payload.interface';
import { FilterAdminDto } from './dto/filter-admin.dto';

@Controller()
export class AdminController {
  constructor(private readonly adminService: AdminService) { }

  // @Post('address-details')
  // @Responsibilities(SUPER_ADMIN, CHAIRMAN)
  // @UseGuards(AuthGuard('admin'), ResponsibilityGuard)
  // addressDetails(@Body() createAdminAddressDto: CreateAdminAddressDetails): Promise<Admin> {
  //   return this.adminService.addressDetails(createAdminAddressDto);
  // }

  // @Post('personal-details')
  // @Responsibilities(SUPER_ADMIN, CHAIRMAN)
  // @UseGuards(AuthGuard('admin'), ResponsibilityGuard)
  // personalDetails(@Body() createAdminPersonalDto: CreateAdminPersonalDetails): Promise<Admin> {
  //   return this.adminService.personalDetails(createAdminPersonalDto);
  // }

  @Post('signin')
  @HttpCode(200)
  signInAdmin(@Body() signInAdminDto: SignInAdminDto): Promise<{ accessToken: string }> {
    return this.adminService.signInAdmin(signInAdminDto);
  }

  @Get('me')
  @UseGuards(AuthGuard('admin'))
  verifyAdminByToken(@GetAdmin('') admin: Admin) {
    return this.adminService.verifyAdminByToken(admin.email);
  }

  @Post('invitation')
  @Responsibilities(SUPER_ADMIN, CHAIRMAN, VICE_PRESIDENT)
  @UseGuards(AuthGuard('admin'), ResponsibilityGuard)
  adminInvitation(@Body() adminInvitationDto: AdminInvitationDto): Promise<void> {
    return this.adminService.adminInvitation(adminInvitationDto);
  }

  @Post('invitation/filter')
  @HttpCode(200)
  @UseGuards(AuthGuard('admin'))
  getAllInvitations(@GetAdmin('') admin: AdminPayload, @Body() filterAdminDto: FilterAdminDto): Promise<Admin[]> {
    return this.adminService.getAllInvitations(admin, filterAdminDto);
  }

  @Get('resend-invitation/:id')
  @Responsibilities(SUPER_ADMIN, CHAIRMAN, VICE_PRESIDENT)
  @UseGuards(AuthGuard('admin'), ResponsibilityGuard)
  resendInvitation(@Param('id') id: string): Promise<void> {
    return this.adminService.resendInvitation(id);
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
