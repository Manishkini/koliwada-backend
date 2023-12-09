import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { Admin } from 'src/schemas/admin.schema';
import { SignInAdminDto } from './dto/sign-in-admin.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetAdmin } from './get-admin.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('admin/signup')
  signUpAdmin(@Body() createAdminDto: CreateAdminDto): Promise<Admin> {
    return this.authService.signUpAdmin(createAdminDto);
  }

  @Post('admin/singin')
  signInAdmin(@Body() signInAdminDto: SignInAdminDto): Promise<{ accessToken: string }> {
    return this.authService.signInAdmin(signInAdminDto);
  }

  @Get('test')
  @UseGuards(AuthGuard('admin'))
  test(@GetAdmin() req) {
    // console.log(req)
  }

  @Get()
  findAll(): Promise<Admin[]> {
    return this.authService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
