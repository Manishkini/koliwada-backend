import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
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
import { Cache } from 'cache-manager';
import { CreateAdminPasswordDto } from './dto/create-admin.dto';
import { GetAdmin } from './get-admin.decorator';

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

  async signInAdmin(
    signInAdminDto: SignInAdminDto,
  ): Promise<{ accessToken: string; admin: Admin }> {
    const { email, password } = signInAdminDto;
    const isValidAdmin = await this.adminModal
      .findOne({ email })
      .populate(['role', 'state', 'district', 'tehsil', 'village']);

    if (isValidAdmin) {
      const isPasswordMatched = await bcrypt.compare(
        password,
        isValidAdmin.password,
      );
      if (isPasswordMatched) {
        const admin = await this.adminModal
          .findOne({
            email,
          })
          .select('-password')
          .populate(['role', 'state', 'district', 'tehsil', 'village']);
        const payload: AdminPayload = {
          firstName: admin.firstName,
          middleName: admin.middleName,
          lastName: admin.lastName,
          mobileNumber: admin.mobileNumber,
          email: admin.email,
          role: admin.role.slug,
          village: admin.village.name,
          permissions: admin.role.permissions,
        };

        const accessToken = this.jwtService.sign(payload);

        return { accessToken, admin };
      } else {
        // wrong password exception
        throw new UnauthorizedException('Please check you login credentials');
      }
    } else {
      // user not found exception
      throw new NotFoundException('Admin Not Found');
    }
  }

  async verifyAdminByToken(email: string): Promise<Admin> {
    const admin = await this.adminModal
      .findOne({
        email,
      })
      .select('-password')
      .populate(['role', 'state', 'district', 'tehsil', 'village']);
    return admin
  }

  async adminInvitation(adminInvitationDto: AdminInvitationDto): Promise<void> {
    const { mobileNumber } = adminInvitationDto;
    const isValidAdmin = await this.adminModal.findOne({ mobileNumber });

    if (isValidAdmin) {
      throw new ConflictException('Admin Already present');
    }
    const admin: AdminDocument = new this.adminModal(adminInvitationDto);
    const partialToken: string = uuidv4();
    await admin.save();
    console.log(String(partialToken));
    await this.cacheManager.set(partialToken, JSON.stringify(admin));
  }

  async getAdminInitialDetails(
    adminPartialToken: string,
  ): Promise<AdminDocument> {
    const adminStringify: string | undefined =
      await this.cacheManager.get(adminPartialToken);

    if (!adminStringify) {
      throw new RequestTimeoutException('Session time out');
    }

    const admin: AdminDocument = JSON.parse(adminStringify);

    return admin;
  }

  async adminResetPassword(
    createAdminPasswordDto: CreateAdminPasswordDto,
  ): Promise<void> {
    const { token, password } = createAdminPasswordDto;
    const adminCachedObj: AdminDocument =
      await this.getAdminInitialDetails(token);
    const admin = await this.adminModal.findById(adminCachedObj._id);

    if (!admin) {
      // user not found exception
      throw new NotFoundException('Admin Not Found');
    }

    try {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);
      const adminUpdate = await this.adminModal.findByIdAndUpdate(admin._id, {
        password: hashedPassword,
      });
      if (!adminUpdate && !adminUpdate._id) {
        throw new InternalServerErrorException(
          'Error occurred while saving admin',
        );
      }
    } catch (err) {
      throw new InternalServerErrorException(
        'Error occurred while saving admin',
      );
    }
  }

  findAll() {
    return `This action returns all admin`;
  }

  findOne(id: number) {
    return `This action returns a #${id} admin`;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(id: number, _updateAdminDto: UpdateAdminDto) {
    return `This action updates a #${id} admin`;
  }

  remove(id: number) {
    return `This action removes a #${id} admin`;
  }
}
