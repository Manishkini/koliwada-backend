import { Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Permission } from 'src/schemas/permission.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class PermissionService {
  constructor(@InjectModel(Permission.name) private permissionModal: Model<Permission>) { }

  async create(createPermissionDto: CreatePermissionDto): Promise<Permission> {
    const permission = new this.permissionModal(createPermissionDto)
    await permission.save();
    return permission;
  }

  async findAll(): Promise<Permission[]> {
    const permissions = await this.permissionModal.find({});
    return permissions;
  }

  findOne(id: number) {
    return `This action returns a #${id} permission`;
  }

  update(id: number, updatePermissionDto: UpdatePermissionDto) {
    return `This action updates a #${id} permission`;
  }

  async remove(id: string): Promise<void> {
    await this.permissionModal.findByIdAndDelete(id);
  }
}
