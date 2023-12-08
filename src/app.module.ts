import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CatsModule } from './cats/cats.module';
import { PermissionModule } from './permission/permission.module';
import { RoleModule } from './role/role.module';
import { AuthModule } from './auth/auth.module';
console.log("process.env.STAGE", process.env)
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
    CatsModule,
    PermissionModule,
    RoleModule,
    AuthModule
  ],
})
export class AppModule { }
