import { PartialType } from '@nestjs/mapped-types';
import { CreateTehsilDto } from './create-tehsil.dto';

export class UpdateTehsilDto extends PartialType(CreateTehsilDto) {}
