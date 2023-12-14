import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin } from 'src/schemas/admin.schema';
import { District } from 'src/schemas/district.schema';
import { Permission } from 'src/schemas/permission.schema';
import { Role } from 'src/schemas/role.schema';
import { State } from 'src/schemas/state.schema';
import { Tehsil } from 'src/schemas/tehsil.schema';
import { Village } from 'src/schemas/village.schema';
import * as bcrypt from 'bcrypt'

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<Admin>,
    @InjectModel(State.name) private stateModel: Model<State>,
    @InjectModel(District.name) private districtModel: Model<District>,
    @InjectModel(Tehsil.name) private tehsilModel: Model<Tehsil>,
    @InjectModel(Village.name) private villageModel: Model<Village>,
    @InjectModel(Role.name) private roleModel: Model<Role>,
    @InjectModel(Permission.name) private permissionModel: Model<Permission>,
  ) { }
  async initialSeed() {
    const adminModel = await this.adminModel.find({})
    if (!adminModel.length) {
      const state = new this.stateModel({ name: "Maharashtra", nameNative: "महाराष्ट्र" })
      const district = new this.districtModel({ name: "Thane", nameNative: "ठाणे", state: state.id })
      const tehsil = new this.tehsilModel({ name: "Borivali", nameNative: "बोरिवली", district: district.id })
      const village = new this.villageModel({ name: "Charkop", nameNative: "चारकोप", tehsil: tehsil.id })
      const permissionPermission = new this.permissionModel({
        name: "permissionManagement",
        permissions: ["createPermissionManagement", "readPermissionManagement", "updatePermissionManagement", "deletePermissionManagement"]
      })
      const permissionRole = new this.permissionModel({
        name: "roleManagement",
        permissions: ["createRoleManagement", "readRoleManagement", "updateRoleManagement", "deleteRoleManagement"]
      })
      const permissionAdmin = new this.permissionModel({
        name: "adminManagement",
        permissions: ["createAdminManagement", "readAdminManagement", "updateAdminManagement", "deleteAdminManagement"]
      })
      const role = new this.roleModel({
        name: "Super Admin",
        nameNative: "प्रशासक",
        slug: "super_admin",
        permissions: [
          "createPermissionManagement", "readPermissionManagement", "updatePermissionManagement", "deletePermissionManagement",
          "createRoleManagement", "readRoleManagement", "updateRoleManagement", "deleteRoleManagement",
          "createAdminManagement", "readAdminManagement", "updateAdminManagement", "deleteAdminManagement"
        ]
      })
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash("Test@123", salt);
      const admin = new this.adminModel({
        state: state.id,
        district: district.id,
        tehsil: tehsil.id,
        village: village.id,
        role: role.id,
        email: 'test@koliwada.com',
        mobileNumber: '+917894561230',
        password: hashedPassword
      })
      await state.save();
      await district.save();
      await tehsil.save();
      await village.save();
      await permissionPermission.save();
      await permissionRole.save();
      await permissionAdmin.save();
      await role.save();
      await admin.save();
    }
  }
  onApplicationBootstrap() {
    this.initialSeed()
  }
}
