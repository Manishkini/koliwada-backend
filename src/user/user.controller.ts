import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from 'src/schemas/user.schema';
import { SignInUserDto } from './dto/sign-in-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './get-user.decorator';
import { GetAdmin } from 'src/admin/get-admin.decorator';
import { AdminPayload } from 'src/admin/admin-payload.interface';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('signup')
  signUpUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.signUpUser(createUserDto);
  }

  @Post('signin')
  @HttpCode(200)
  signInUser(@Body() signInUserDto: SignInUserDto): Promise<{ accessToken: string, user: User }> {
    return this.userService.signInUser(signInUserDto);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @UseGuards(AuthGuard('admin'))
  findAll(@GetAdmin('') admin: AdminPayload) {
    return this.userService.findAll(admin);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
