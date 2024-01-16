import { Module } from '@nestjs/common';
import { ResponsibilityService } from './responsibility.service';
import { ResponsibilityController } from './responsibility.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Responsibility, ResponsibilitySchema } from 'src/schemas/responsibility.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Responsibility.name, schema: ResponsibilitySchema }])],
  controllers: [ResponsibilityController],
  providers: [ResponsibilityService],
})
export class ResponsibilityModule { }
