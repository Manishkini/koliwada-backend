import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin } from 'src/schemas/admin.schema';
import { District } from 'src/schemas/district.schema';
import { Permission } from 'src/schemas/permission.schema';
import { State } from 'src/schemas/state.schema';
import { Tehsil } from 'src/schemas/tehsil.schema';
import { Village } from 'src/schemas/village.schema';
import * as bcrypt from 'bcrypt';
import { Responsibility } from 'src/schemas/responsibility.schema';
import { Role } from 'src/schemas/role.schema';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<Admin>,
    @InjectModel(State.name) private stateModel: Model<State>,
    @InjectModel(District.name) private districtModel: Model<District>,
    @InjectModel(Tehsil.name) private tehsilModel: Model<Tehsil>,
    @InjectModel(Village.name) private villageModel: Model<Village>,
    @InjectModel(Role.name) private roleModel: Model<Role>,
    @InjectModel(Responsibility.name) private responsibilityModel: Model<Responsibility>,
    @InjectModel(Permission.name) private permissionModel: Model<Permission>,
  ) { }
  async initialSeed() {
    const adminModel = await this.adminModel.find({});
    if (!adminModel.length) {
      const state = new this.stateModel({
        name: 'Maharashtra',
        nameNative: 'महाराष्ट्र',
        slug: 'maharashtra',
      });
      const district = new this.districtModel({
        name: 'Mumbai Suburban',
        nameNative: 'मुंबई उपनगर',
        slug: 'mumbai_suburban',
        state: state.id,
      });
      const tehsil = new this.tehsilModel({
        name: 'Borivali',
        nameNative: 'बोरिवली',
        slug: 'borivali',
        district: district.id,
      });
      const village = new this.villageModel({
        name: 'Charkop',
        nameNative: 'चारकोप',
        slug: 'charkop',
        tehsil: tehsil.id,
      });

      const permissionPermission = new this.permissionModel({ name: 'Permission' });
      const permissionRole = new this.permissionModel({ name: 'Role' });
      const permissionResponsibility = new this.permissionModel({ name: 'Responsibility' });
      const permissionAdmin = new this.permissionModel({ name: 'Invitation' });

      const roleSuperAdmin = new this.roleModel({
        name: 'Super Admin',
        nameNative: 'उच्च प्रशासक',
        slug: 'super_admin',
        rank: 1
      });
      const roleAdmin = new this.roleModel({
        name: 'Admin',
        nameNative: 'प्रशासक',
        slug: 'admin',
        rank: 2
      });
      const roleChairman = new this.roleModel({
        name: 'Chairman',
        nameNative: 'अध्यक्ष',
        slug: 'chairman',
        rank: 3
      });

      const responsibilitySuperAdmin = new this.responsibilityModel({
        role: roleSuperAdmin._id,
        permissions: [
          {
            subject: 'Responsibility',
            actions: ['read', 'create', 'update', 'delete']
          },
          {
            subject: 'Permission',
            actions: ['read', 'create', 'update', 'delete']
          },
          {
            subject: 'Role',
            actions: ['read', 'create', 'update', 'delete']
          },
          {
            subject: 'Invitation',
            actions: ['read', 'create', 'update', 'delete']
          }
        ],
      });
      const responsibilityAdmin = new this.responsibilityModel({
        role: roleAdmin._id,
        permissions: [
          {
            subject: 'Responsibility',
            actions: ['read']
          },
          {
            subject: 'Permission',
            actions: ['read', 'create', 'update', 'delete']
          },
          {
            subject: 'Role',
            actions: ['read', 'create', 'update', 'delete']
          },
          {
            subject: 'Invitation',
            actions: ['read', 'create', 'update', 'delete']
          }
        ],
      });
      const responsibilityChairman = new this.responsibilityModel({
        role: roleChairman._id,
        permissions: [
          {
            subject: 'Invitation',
            actions: ['read', 'create', 'update', 'delete']
          }
        ],
      });

      const salt = await bcrypt.genSalt();
      const hashedPasswordSuperAdmin = await bcrypt.hash('superAdmin', salt);
      const hashedPasswordAdmin = await bcrypt.hash('admin', salt);
      const hashedPasswordChairman = await bcrypt.hash('chairman', salt);

      const superAdmin = new this.adminModel({
        state: state.id,
        district: district.id,
        tehsil: tehsil.id,
        village: village.id,
        responsibility: responsibilitySuperAdmin.id,
        email: 'superadmin@vuexy.com',
        mobileNumber: '+917894561230',
        password: hashedPasswordSuperAdmin,
      });
      const admin = new this.adminModel({
        state: state.id,
        district: district.id,
        tehsil: tehsil.id,
        village: village.id,
        responsibility: responsibilityAdmin.id,
        email: 'admin@vuexy.com',
        mobileNumber: '+917894561231',
        password: hashedPasswordAdmin,
      });
      const chairman = new this.adminModel({
        state: state.id,
        district: district.id,
        tehsil: tehsil.id,
        village: village.id,
        responsibility: responsibilityChairman.id,
        email: 'chairman@vuexy.com',
        mobileNumber: '+917894561232',
        password: hashedPasswordChairman,
      });

      // Locations
      await state.save();
      await district.save();
      await tehsil.save();
      await village.save();

      // Permissions
      await permissionPermission.save();
      await permissionRole.save();
      await permissionAdmin.save();
      await permissionResponsibility.save();

      // Roles
      await roleSuperAdmin.save();
      await roleAdmin.save();
      await roleChairman.save();

      // Responsibility
      await responsibilitySuperAdmin.save();
      await responsibilityAdmin.save();
      await responsibilityChairman.save();

      // Admins
      await superAdmin.save();
      await admin.save();
      await chairman.save();
    }
  }
  onApplicationBootstrap() {
    this.initialSeed();
  }
}
