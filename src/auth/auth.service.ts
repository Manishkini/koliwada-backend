import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { CreateAdminDto } from './dto/create-admin.dto';
import { Admin } from 'src/schemas/admin.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
import { SignInAdminDto } from './dto/sign-in-admin.dto';
import { AdminPayload } from './admin-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Admin.name) private adminModal: Model<Admin>,
    @InjectModel(User.name) private userModal: Model<User>,
    private jwtService: JwtService
  ) { }

  async signUpAdmin(createAdminDto: CreateAdminDto): Promise<Admin> {
    const admin = new this.adminModal(createAdminDto)
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createAdminDto.password, salt);
    admin.password = hashedPassword;
    await admin.save();
    return admin;
  }

  async signInAdmin(signInAdminDto: SignInAdminDto): Promise<{ accessToken: string }> {
    const { mobileNumber, password } = signInAdminDto
    const admin = await this.adminModal.findOne({
      mobileNumber
    }).populate('role');

    if (admin) {
      const isPasswordMatched = await bcrypt.compare(password, admin.password)
      if (isPasswordMatched) {
        const payload: AdminPayload = {
          firstName: admin.firstName,
          middleName: admin.middleName,
          lastName: admin.lastName,
          mobileNumber: admin.mobileNumber,
          email: admin.email,
          role: admin.role,
          permissions: admin.role.permissions,
        }
        const accessToken = await this.jwtService.sign(payload)

        return { accessToken }
      } else {
        // wrong password exception
        throw new UnauthorizedException("Please check you login credentials")
      }
    } else {
      // user not found exception
      throw new NotFoundException("Admin Not Found")
    }
  }

  create(createAuthDto: CreateAuthDto) {
    return 'This action adds a new auth';
  }

  async findAll(): Promise<Admin[]> {
    return await this.adminModal.find({});
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
