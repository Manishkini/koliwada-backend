import { Inject, Injectable, NotFoundException, RequestTimeoutException, UnauthorizedException } from '@nestjs/common';
// import { CreateAdminAddressDetails, CreateAdminPersonalDetails } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Admin, AdminDocument } from 'src/schemas/admin.schema';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { SignInAdminDto } from './dto/sign-in-admin.dto';
import { AdminPayload } from './admin-payload.interface';
import { AdminInvitationDto } from './dto/admin-invitation.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager'
import { CreateAdminPasswordDto } from './dto/create-admin.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin.name) private adminModal: Model<Admin>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private jwtService: JwtService,
  ) { }

  // async addressDetails(createAdminDto: CreateAdminAddressDetails): Promise<Admin> {
  //   const admin = new this.adminModal(createAdminDto)
  //   await admin.save();
  //   return admin;
  // }

  // async personalDetails(createAdminPersonalDto: CreateAdminPersonalDetails): Promise<Admin> {
  //   const admin = new this.adminModal(createAdminPersonalDto)
  //   const salt = await bcrypt.genSalt();
  //   const hashedPassword = await bcrypt.hash(createAdminPersonalDto.password, salt);
  //   admin.password = hashedPassword;
  //   await admin.save();
  //   return admin;
  // }

  async signInAdmin(signInAdminDto: SignInAdminDto): Promise<{ accessToken: string }> {
    const { mobileNumber, password } = signInAdminDto
    const admin = await this.adminModal.findOne({
      mobileNumber
    }).populate(['role', 'village']);

    if (admin) {
      const isPasswordMatched = await bcrypt.compare(password, admin.password)
      if (isPasswordMatched) {
        const payload: AdminPayload = {
          firstName: admin.firstName,
          middleName: admin.middleName,
          lastName: admin.lastName,
          mobileNumber: admin.mobileNumber,
          email: admin.email,
          role: admin.role.slug,
          village: admin.village.name,
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

  async adminInvitation(adminInvitationDto: AdminInvitationDto): Promise<void> {
    const admin: AdminDocument = new this.adminModal(adminInvitationDto)
    const partialToken: string = uuidv4()
    console.log(String(partialToken))
    await this.cacheManager.set(partialToken, JSON.stringify(admin))
    return
  }

  async getAdminInitialDetails(adminPartialToken: string): Promise<AdminDocument> {
    const adminStringify: string | undefined = await this.cacheManager.get(adminPartialToken);

    if (!adminStringify) {
      throw new RequestTimeoutException("Session time out")
    }

    const admin: AdminDocument = JSON.parse(adminStringify);

    return admin;
  }

  async adminResetPassword(createAdminPasswordDto: CreateAdminPasswordDto): Promise<void> {
    const { token, password } = createAdminPasswordDto;
    const adminCachedObj: Admin = await this.getAdminInitialDetails(token);
    const { state, district, tehsil, village, role, mobileNumber, email } = adminCachedObj
    const admin: AdminDocument = new this.adminModal({ state, district, tehsil, village, role, email, mobileNumber, password })
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    admin.password = hashedPassword;
    await admin.save();
    return
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
