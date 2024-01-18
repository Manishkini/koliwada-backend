import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from 'src/schemas/role.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateRankDto } from './dto/update-rank.dto';

@Injectable()
export class RoleService {
  constructor(@InjectModel(Role.name) private roleModal: Model<Role>) { }

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    try {
      const lastRankObj = await this.roleModal.findOne({}).select('rank').sort({ 'rank': 'descending' })
      const role = new this.roleModal({ ...createRoleDto, rank: lastRankObj.rank + 1 })
      await role.save();
      return role;
    } catch (err) {
      throw new InternalServerErrorException(err)
    }
  }

  async updateRank(updateRankDto: UpdateRankDto): Promise<void> {
    try {
      for await (let obj of updateRankDto.roles) {
        const { id, rank } = obj
        const updatedRole = await this.roleModal.findByIdAndUpdate(id, { rank })
        if (updatedRole?._id) {
          throw new NotFoundException(`Role with id:${id} not found`)
        }
      }
    } catch (err) {
      throw new InternalServerErrorException(err)
    }
  }

  async findAll(): Promise<Role[]> {
    try {
      const roles = await this.roleModal.find({});
      return roles;
    } catch (err) {
      throw new InternalServerErrorException(err)
    }
  }

  findOne(id: string) {
    return `This action returns a #${id} role`;
  }

  async update(id: string, updateRoleDto: UpdateRoleDto): Promise<void> {
    try {
      const { name, nameNative, slug } = updateRoleDto
      const role = await this.roleModal.findById(id)
      if (!role) {
        throw new NotFoundException(`Role with id:${id} not found`)
      }

      await role.updateOne({
        name,
        nameNative,
        slug,
      }).then(() => {
        console.log(role)
      }).catch(err => {
        throw new InternalServerErrorException(err)
      })
    } catch (err) {
      throw new InternalServerErrorException(err)
    }
  }

  remove(id: string) {
    return `This action removes a #${id} role`;
  }
}
