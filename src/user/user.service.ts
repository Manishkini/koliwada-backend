import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schemas/user.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt'
import { SignInUserDto } from './dto/sign-in-user.dto';
import { UserPayload } from './user-payload.interface';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private userModal: Model<User>,
        private jwtService: JwtService
    ) { }

    async signUpUser(createUserDto: CreateUserDto): Promise<User> {
        const user = new this.userModal(createUserDto)
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
        user.password = hashedPassword;
        await user.save();
        return user;
    }

    async signInUser(signInUserDto: SignInUserDto): Promise<{ accessToken: string }> {
        const { mobileNumber, password } = signInUserDto
        const user = await this.userModal.findOne({
            mobileNumber
        }).populate('village');

        if (user) {
            const isPasswordMatched = await bcrypt.compare(password, user.password)
            if (isPasswordMatched) {
                const payload: UserPayload = {
                    id: user.id,
                    firstName: user.firstName,
                    middleName: user.middleName,
                    lastName: user.lastName,
                    mobileNumber: user.mobileNumber,
                    email: user.email,
                    village: user.village.name,
                }
                const accessToken = this.jwtService.sign(payload)

                return { accessToken }
            } else {
                // wrong password exception
                throw new UnauthorizedException("Please check you login credentials")
            }
        } else {
            // user not found exception
            throw new NotFoundException("User Not Found")
        }
    }

    create(createUserDto: CreateUserDto) {
        return 'This action adds a new user';
    }

    findAll() {
        return `This action returns all user`;
    }

    findOne(id: number) {
        return `This action returns a #${id} user`;
    }

    update(id: number, updateUserDto: UpdateUserDto) {
        return `This action updates a #${id} user`;
    }

    remove(id: number) {
        return `This action removes a #${id} user`;
    }
}
