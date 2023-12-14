import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminSchema } from 'src/schemas/admin.schema';
import { JwtAdminStrategy } from './jwt-admin.strategy';

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET_ADMIN'),
        signOptions: {
          expiresIn: '1h'
        }
      })
    }),
    MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }]),
  ],
  controllers: [AdminController],
  providers: [JwtAdminStrategy, AdminService],
  exports: [JwtAdminStrategy, PassportModule]
})
export class AdminModule { }
