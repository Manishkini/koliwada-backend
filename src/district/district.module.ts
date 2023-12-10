import { Module } from '@nestjs/common';
import { DistrictService } from './district.service';
import { DistrictController } from './district.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { District, DistrictSchema } from 'src/schemas/district.schema';
import { AdminModule } from 'src/admin/admin.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: District.name, schema: DistrictSchema }]), AdminModule, UserModule],
  controllers: [DistrictController],
  providers: [DistrictService],
})
export class DistrictModule { }
