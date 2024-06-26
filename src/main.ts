import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import * as morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.use(morgan('dev'));
  app.setGlobalPrefix('api');
  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(9630);
}
bootstrap();
