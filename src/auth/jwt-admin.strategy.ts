import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { PassportStrategy } from "@nestjs/passport";
import { Model } from "mongoose";
import { Admin } from "src/schemas/admin.schema";
import { ExtractJwt, Strategy } from 'passport-jwt'
import { AdminPayload } from "./admin-payload.interface";

@Injectable()
export class JwtAdminStrategy extends PassportStrategy(Strategy, 'admin') {
    constructor(
        @InjectModel(Admin.name) private adminModal: Model<Admin>,
        private configService: ConfigService
    ) {
        super({
            secretOrKey: configService.get('JWT_SECRET'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        })
    }

    async validate(payload: AdminPayload): Promise<Admin> {
        const { mobileNumber } = payload
        const admin: Admin = await this.adminModal.findOne({ mobileNumber }).select('-password');

        if (!admin) {
            throw new UnauthorizedException("Admin Not Found")
        }

        return admin;
    }
}