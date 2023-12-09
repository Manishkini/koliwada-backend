import { Module } from '@nestjs/common';
import { TehsilService } from './tehsil.service';
import { TehsilController } from './tehsil.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Tehsil, TehsilSchema } from 'src/schemas/tehsil.schema';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Tehsil.name, schema: TehsilSchema }]), AuthModule],
  controllers: [TehsilController],
  providers: [TehsilService],
})
export class TehsilModule { }
