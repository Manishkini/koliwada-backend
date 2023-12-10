import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { PassportStrategy } from "@nestjs/passport";
import { Model } from "mongoose";
import { ExtractJwt, Strategy } from 'passport-jwt'
import { User } from "src/schemas/user.schema";
import { UserPayload } from "./user-payload.interface";

@Injectable()
export class JwtUserStrategy extends PassportStrategy(Strategy, 'user') {
    constructor(
        @InjectModel(User.name) private userModal: Model<User>,
        private configService: ConfigService
    ) {
        super({
            secretOrKey: configService.get('JWT_SECRET_USER'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        })
    }

    async validate(payload: UserPayload): Promise<User> {
        const { id } = payload
        const user: User = await this.userModal.findById(id).select('-password');

        if (!user) {
            throw new UnauthorizedException()
        }

        return user;
    }
}