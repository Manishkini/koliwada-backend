import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PermissionModule } from './permission/permission.module';
import { RoleModule } from './role/role.module';
import { AuthModule } from './auth/auth.module';
import { StateModule } from './state/state.module';
import { TehsilModule } from './tehsil/tehsil.module';
import { VillageModule } from './village/village.module';
import { DistrictModule } from './district/district.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URL')
      }),
      inject: [ConfigService],
    }),
    PermissionModule,
    RoleModule,
    AuthModule,
    StateModule,
    TehsilModule,
    VillageModule,
    DistrictModule
  ],
})
export class AppModule { }
