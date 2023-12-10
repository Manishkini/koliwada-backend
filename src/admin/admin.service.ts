import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Admin } from 'src/schemas/admin.schema';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { SignInAdminDto } from './dto/sign-in-admin.dto';
import { AdminPayload } from './admin-payload.interface';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin.name) private adminModal: Model<Admin>,
    private jwtService: JwtService,
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
          id: admin.id,
          firstName: admin.firstName,
          middleName: admin.middleName,
          lastName: admin.lastName,
          mobileNumber: admin.mobileNumber,
          email: admin.email,
          role: admin.role.name,
          permissions: admin.role.permissions,
        }
        const accessToken = this.jwtService.sign(payload)

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

  create(createAdminDto: CreateAdminDto) {
    return 'This action adds a new admin';
  }

  findAll() {
    return `This action returns all admin`;
  }

  findOne(id: number) {
    return `This action returns a #${id} admin`;
  }

  update(id: number, updateAdminDto: UpdateAdminDto) {
    return `This action updates a #${id} admin`;
  }

  remove(id: number) {
    return `This action removes a #${id} admin`;
  }
}
