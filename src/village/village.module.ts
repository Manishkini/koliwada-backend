import { Module } from '@nestjs/common';
import { VillageService } from './village.service';
import { VillageController } from './village.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Village, VillageSchema } from 'src/schemas/village.schema';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Village.name, schema: VillageSchema }]), AuthModule],
  controllers: [VillageController],
  providers: [VillageService],
})
export class VillageModule { }
