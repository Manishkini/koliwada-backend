import { SetMetadata } from '@nestjs/common';

export const Responsibilities = (...responsibility: string[]) => SetMetadata('responsibility', responsibility);