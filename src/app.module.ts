import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PermissionModule } from './permission/permission.module';
import { RoleModule } from './role/role.module';
import { StateModule } from './state/state.module';
import { TehsilModule } from './tehsil/tehsil.module';
import { VillageModule } from './village/village.module';
import { DistrictModule } from './district/district.module';
import { AdminModule } from './admin/admin.module';
import { UserModule } from './user/user.module';
import { RouterModule } from '@nestjs/core';
import { CacheModule } from '@nestjs/cache-manager';
import { SeedModule } from './seed/seed.module';
import { ResponsibilityModule } from './responsibility/responsibility.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

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
    RouterModule.register([
      {
        path: 'auth',
        children: [
          {
            path: 'admin',
            module: AdminModule
          },
          {
            path: 'user',
            module: UserModule
          }
        ]
      }
    ]),
    CacheModule.register({
      isGlobal: true,
      ttl: 60 * 60 * 1000
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/static'
    }),
    PermissionModule,
    RoleModule,
    StateModule,
    TehsilModule,
    VillageModule,
    DistrictModule,
    AdminModule,
    UserModule,
    SeedModule,
    ResponsibilityModule,
  ],
})
export class AppModule { }
