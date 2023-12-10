import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from 'src/schemas/user.schema';
import { SignInUserDto } from './dto/sign-in-user.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('signup')
  signUpUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.signUpUser(createUserDto);
  }

  @Post('singin')
  signInUser(@Body() signInUserDto: SignInUserDto): Promise<{ accessToken: string }> {
    return this.userService.signInUser(signInUserDto);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
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
