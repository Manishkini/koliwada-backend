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
import mongoose, { Model, Types, PipelineStage } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { SignInAdminDto } from './dto/sign-in-admin.dto';
import { AdminPayload } from './admin-payload.interface';
import { AdminInvitationDto } from './dto/admin-invitation.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CreateAdminPasswordDto } from './dto/create-admin.dto';
import { GetAdmin } from './get-admin.decorator';
import { InvitationStatus } from './invitation-status.enum';
import { FilterAdminDto } from './dto/filter-admin.dto';

type TObjectId = Types.ObjectId;
const ObjectId = (id) => { return new mongoose.Types.ObjectId(id as unknown as string) }
const populateDocument = [
  {
    from: 'responsibilities',
    localField: 'responsibility',
    foreignField: '_id',
    as: 'responsibility',
  },
  {
    from: 'states',
    localField: 'state',
    foreignField: '_id',
    as: 'state',
  },
  {
    from: 'districts',
    localField: 'district',
    foreignField: '_id',
    as: 'district',
  },
  {
    from: 'tehsils',
    localField: 'tehsil',
    foreignField: '_id',
    as: 'tehsil',
  },
  {
    from: 'villages',
    localField: 'village',
    foreignField: '_id',
    as: 'village',
  },
  {
    from: 'roles',
    localField: 'responsibility.role',
    foreignField: '_id',
    as: 'responsibility.role',
  },
]

interface MongoMatchObject {
  $and?: object
  role?: TObjectId
  village?: TObjectId
  invitationStatus?: InvitationStatus
}

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
    const admin: Admin = await this.adminModal
      .findOne({
        email,
      })
      .populate(['responsibility', 'state', 'district', 'tehsil', 'village'])
      .populate({
        path: 'responsibility',
        populate: {
          path: 'role'
        }
      }).lean();

    if (admin) {
      const isPasswordMatched = await bcrypt.compare(
        password,
        admin.password,
      );
      if (isPasswordMatched) {
        delete admin.password;
        const payload: AdminPayload = {
          firstName: admin.firstName,
          middleName: admin.middleName,
          lastName: admin.lastName,
          mobileNumber: admin.mobileNumber,
          email: admin.email,
          role: admin.responsibility.role.slug,
          village: admin.village.name,
          permissions: admin.responsibility.permissions,
          rank: admin.responsibility.role.rank,
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
      .populate(['responsibility', 'state', 'district', 'tehsil', 'village'])
      .populate({
        path: 'responsibility',
        populate: {
          path: 'role'
        }
      });
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

  /*
    getAllInvitations: Used to send all the admins data based on there role and filters they have used
  */
  async getAllInvitations(admin: AdminPayload, filterAdminDto: FilterAdminDto): Promise<Admin[]> {
    try {
      const { role, villageID, accessTo, id } = admin
      const pipeline: PipelineStage[] = [];
      const matchAndConditions: any[] = [];
      const matchOrConditions: any[] = [];
      const DEFAULT_LIMIT = 10;
      const DEFAULT_SKIP = 0;

      // Checking whether user is normal user or admin user
      // if normal user 
      if (role !== 'super_admin' && role !== 'admin') {
        pipeline.push({ $match: { village: ObjectId(villageID as unknown as string) } })
        matchAndConditions.push({ 'responsibility.role.slug': { $ne: 'super_admin' } })
        matchAndConditions.push({ 'responsibility.role.slug': { $ne: 'admin' } })
      } else if (role === 'admin') {
        matchAndConditions.push({ 'responsibility.role.slug': { $ne: 'super_admin' } })
      }

      if (filterAdminDto && Object.keys(filterAdminDto).length) {
        if (filterAdminDto.responsibility) {
          matchAndConditions.push({ 'responsibility._id': ObjectId(filterAdminDto.responsibility as unknown as string) })
        }
        if (filterAdminDto.state) {
          matchAndConditions.push({ 'state._id': ObjectId(filterAdminDto.state as unknown as string) })
        }
        if (filterAdminDto.district) {
          matchAndConditions.push({ 'district._id': ObjectId(filterAdminDto.district as unknown as string) })
        }
        if (filterAdminDto.tehsil) {
          matchAndConditions.push({ 'tehsil._id': ObjectId(filterAdminDto.tehsil as unknown as string) })
        }
        if (filterAdminDto.village) {
          matchAndConditions.push({ 'village._id': ObjectId(filterAdminDto.village as unknown as string) })
        }
        if (filterAdminDto.invitationStatus) {
          matchAndConditions.push({ invitationStatus: filterAdminDto.invitationStatus })
        }
        if (filterAdminDto.searchString) {
          matchOrConditions.push({ firstName: { $regex: new RegExp(filterAdminDto.searchString, 'i') } })
          matchOrConditions.push({ middleName: { $regex: new RegExp(filterAdminDto.searchString, 'i') } })
          matchOrConditions.push({ lastName: { $regex: new RegExp(filterAdminDto.searchString, 'i') } })
          matchOrConditions.push({ firstNameNative: { $regex: new RegExp(filterAdminDto.searchString, 'i') } })
          matchOrConditions.push({ middleNameNative: { $regex: new RegExp(filterAdminDto.searchString, 'i') } })
          matchOrConditions.push({ lastNameNative: { $regex: new RegExp(filterAdminDto.searchString, 'i') } })
          matchOrConditions.push({ email: { $regex: new RegExp(filterAdminDto.searchString, 'i') } })
          matchOrConditions.push({ phone: { $regex: new RegExp(filterAdminDto.searchString, 'i') } })
        }
      }

      populateDocument.forEach((document) => {
        pipeline.push({ $lookup: document })
        pipeline.push({ $unwind: `$${document.as}` })
      })

      matchAndConditions.push({ _id: { $ne: ObjectId(id as unknown as string) } })
      if (matchAndConditions?.length && matchOrConditions?.length) {
        pipeline.push({ $match: { $and: [...matchAndConditions, { $or: matchOrConditions }] } })
      } else if (matchAndConditions?.length) {
        pipeline.push({ $match: { $and: matchAndConditions } })
      } else if (matchOrConditions?.length) {
        pipeline.push({ $match: { $or: matchOrConditions } })
      }

      pipeline.push({
        $addFields: {
          id: '$_id',
          'responsibility.id': '$responsibility._id',
          'responsibility.role.id': '$responsibility.role._id',
          'state.id': '$state._id',
          'district.id': '$district._id',
          'tehsil.id': '$tehsil._id',
          'village.id': '$village._id',
        }
      })

      pipeline.push({
        $project: {
          password: 0,
          __v: 0,
          _id: 0,
          'responsibility._id': 0,
          'state._id': 0,
          'district._id': 0,
          'tehsil._id': 0,
          'village._id': 0,
          'responsibility.role._id': 0
        }
      })
      pipeline.push({ $limit: filterAdminDto.limit || DEFAULT_LIMIT })
      pipeline.push({ $skip: filterAdminDto.skip || DEFAULT_SKIP })

      return await this.adminModal.aggregate(pipeline);
    } catch (err) {
      console.log(err)
    }
  }

  async resendInvitation(id: string): Promise<void> {
    const admin: AdminDocument = await this.adminModal.findById(id);
    if (!admin) {
      throw new NotFoundException('Admin Not Found');
    }
    const partialToken: string = uuidv4();
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
        invitationStatus: InvitationStatus.VERIFIED
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
