import { Module } from '@nestjs/common';
import { TehsilService } from './tehsil.service';
import { TehsilController } from './tehsil.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Tehsil, TehsilSchema } from 'src/schemas/tehsil.schema';
import { AdminModule } from 'src/admin/admin.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Tehsil.name, schema: TehsilSchema }]), AdminModule],
  controllers: [TehsilController],
  providers: [TehsilService],
})
export class TehsilModule { }
