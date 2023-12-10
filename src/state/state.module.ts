import { Module } from '@nestjs/common';
import { StateService } from './state.service';
import { StateController } from './state.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { State, StateSchema } from 'src/schemas/state.schema';
import { AdminModule } from 'src/admin/admin.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: State.name, schema: StateSchema }]), AdminModule],
  controllers: [StateController],
  providers: [StateService],
})
export class StateModule { }
