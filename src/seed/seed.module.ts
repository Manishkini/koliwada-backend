import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { MongooseModule } from '@nestjs/mongoose';
import { State, StateSchema } from 'src/schemas/state.schema';
import { District, DistrictSchema } from 'src/schemas/district.schema';
import { Tehsil, TehsilSchema } from 'src/schemas/tehsil.schema';
import { Village, VillageSchema } from 'src/schemas/village.schema';
import { Admin, AdminSchema } from 'src/schemas/admin.schema';
import { Permission, PermissionSchema } from 'src/schemas/permission.schema';
import { Responsibility, ResponsibilitySchema } from 'src/schemas/responsibility.schema';
import { Role, RoleSchema } from 'src/schemas/role.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
    MongooseModule.forFeature([{ name: Responsibility.name, schema: ResponsibilitySchema }]),
    MongooseModule.forFeature([{ name: Permission.name, schema: PermissionSchema }]),
    MongooseModule.forFeature([{ name: State.name, schema: StateSchema }]),
    MongooseModule.forFeature([{ name: District.name, schema: DistrictSchema }]),
    MongooseModule.forFeature([{ name: Tehsil.name, schema: TehsilSchema }]),
    MongooseModule.forFeature([{ name: Village.name, schema: VillageSchema }]),
    MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }])
  ],
  providers: [SeedService],
})
export class SeedModule { }
