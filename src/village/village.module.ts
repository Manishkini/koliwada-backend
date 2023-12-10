import { Module } from '@nestjs/common';
import { VillageService } from './village.service';
import { VillageController } from './village.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Village, VillageSchema } from 'src/schemas/village.schema';
import { AdminModule } from 'src/admin/admin.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Village.name, schema: VillageSchema }]), AdminModule, UserModule],
  controllers: [VillageController],
  providers: [VillageService],
})
export class VillageModule { }
