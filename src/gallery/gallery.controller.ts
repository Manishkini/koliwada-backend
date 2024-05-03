import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles, UseGuards } from '@nestjs/common';
import { GalleryService } from './gallery.service';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import { UpdateGalleryDto } from './dto/update-gallery.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Responsibilities } from 'src/responsibility/responsibilities.decorator';
import { CHAIRMAN, SUPER_ADMIN, VICE_PRESIDENT } from 'src/role/roles-list.enum';
import { AuthGuard } from '@nestjs/passport';
import { ResponsibilityGuard } from 'src/responsibility/responsibility.guard';
import { GetAdmin } from 'src/admin/get-admin.decorator';
import { AdminDocument } from 'src/schemas/admin.schema';
import { Gallery } from 'src/schemas/gallery.schema';
import { Photo } from 'src/schemas/photos.schema';

@Controller('gallery')
@Responsibilities(SUPER_ADMIN, CHAIRMAN, VICE_PRESIDENT)
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  @Post()
  @UseGuards(AuthGuard('admin'), ResponsibilityGuard)
  @UseInterceptors(FilesInterceptor('files'))
  create(@GetAdmin() admin: AdminDocument, @UploadedFiles() files: Array<Express.Multer.File>, @Body() createGalleryDto: CreateGalleryDto): Promise<void> {
    return this.galleryService.create(admin, files, createGalleryDto)
  }

  @Get()
  findAll(): Promise<Gallery[]> {
    return this.galleryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Gallery> {
    return this.galleryService.findOne(id);
  }

  @Get(':id/photos')
  findAllPhotos(@Param('id') id: string): Promise<Photo[]> {
    return this.galleryService.findAllPhotos(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('admin'), ResponsibilityGuard)
  @UseInterceptors(FilesInterceptor('files'))
  update(
    @Param('id') id: string,
    @GetAdmin() admin: AdminDocument,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() updateGalleryDto: UpdateGalleryDto
  ): Promise<void> {
    return this.galleryService.update(id, admin, files, updateGalleryDto);
  }

  @Get(':id/status/:status')
  @UseGuards(AuthGuard('admin'), ResponsibilityGuard)
  updateStatus(
    @Param('id') id: string,
    @GetAdmin() admin: AdminDocument,
    @Param('status') status: string,
  ): Promise<void> {
    return this.galleryService.updateStatus(id, admin, status);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('admin'), ResponsibilityGuard)
  remove(@Param('id') id: string): Promise<void> {
    return this.galleryService.remove(id);
  }

  @Delete(':galleryId/photos')
  @UseGuards(AuthGuard('admin'), ResponsibilityGuard)
  removeAllPhotos(@Param('galleryId') galleryId: string): Promise<void> {
    return this.galleryService.removeAllPhotos(galleryId);
  }

  @Delete(':galleryId/photo/:photoId')
  @UseGuards(AuthGuard('admin'), ResponsibilityGuard)
  removeSinglePhoto(@Param('galleryId') galleryId: string, @Param('photoId') photoId: string): Promise<void> {
    return this.galleryService.removeSinglePhoto(galleryId, photoId);
  }
}
