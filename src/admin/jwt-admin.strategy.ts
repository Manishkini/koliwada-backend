import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { PassportStrategy } from "@nestjs/passport";
import { Model } from "mongoose";
import { Admin, AdminDocument } from "src/schemas/admin.schema";
import { ExtractJwt, Strategy } from 'passport-jwt'
import { AdminPayload } from "./admin-payload.interface";
import { AdminEntity } from "./entity/admin.entity";

@Injectable()
export class JwtAdminStrategy extends PassportStrategy(Strategy, 'admin') {
    constructor(
        @InjectModel(Admin.name) private adminModal: Model<Admin>,
        private configService: ConfigService
    ) {
        super({
            secretOrKey: configService.get('JWT_SECRET_ADMIN'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        })
    }

    async validate(payload: AdminPayload): Promise<AdminPayload> {
        const { mobileNumber } = payload
        const admin: AdminEntity = await this.adminModal
            .findOne({ mobileNumber })
            .populate(['responsibility', 'village'])
            .populate({
                path: 'responsibility',
                populate: {
                    path: 'role'
                }
            });

        if (!admin) {
            throw new UnauthorizedException()
        }
        payload.id = admin.id;
        payload.responsibilityID = admin.responsibility.id;
        payload.role = admin.responsibility.role.slug;
        payload.rank = admin.responsibility.role.rank;
        payload.villageID = admin.village.id;

        return payload;
    }
}