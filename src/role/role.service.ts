import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from 'src/schemas/role.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class RoleService {
  constructor(@InjectModel(Role.name) private roleModal: Model<Role>) { }

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const role = new this.roleModal(createRoleDto)
    await role.save();
    return role;
  }

  async findAll(): Promise<Role[]> {
    const roles = await this.roleModal.find({});
    return roles;
  }

  findOne(id: number) {
    return `This action returns a #${id} role`;
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return `This action updates a #${id} role`;
  }

  remove(id: number) {
    return `This action removes a #${id} role`;
  }
}
