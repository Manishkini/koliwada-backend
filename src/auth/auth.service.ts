import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { CreateAdminDto } from './dto/create-admin.dto';
import { Admin } from 'src/schemas/admin.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Admin.name) private adminModal: Model<Admin>,
    @InjectModel(User.name) private userModal: Model<User>
  ) { }

  async createAdmin(createAdminDto: CreateAdminDto): Promise<Admin> {
    const admin = new this.adminModal(createAdminDto)
    await admin.save();
    return admin;
  }

  create(createAuthDto: CreateAuthDto) {
    return 'This action adds a new auth';
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
