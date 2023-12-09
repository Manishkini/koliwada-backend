import { Module } from '@nestjs/common';
import { DistrictService } from './district.service';
import { DistrictController } from './district.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { District, DistrictSchema } from 'src/schemas/district.schema';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: District.name, schema: DistrictSchema }]), AuthModule],
  controllers: [DistrictController],
  providers: [DistrictService],
})
export class DistrictModule { }
