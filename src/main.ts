import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';
import { GlobalExceptionFilter } from './filters/global-exception.filter';
import { HttpExceptionFilter } from './filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new ConfigService();
  app.enableCors();
  app.useGlobalFilters(new GlobalExceptionFilter(), new HttpExceptionFilter());
  app.setGlobalPrefix('/v1');
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(config.get('PORT') || 80);
}
bootstrap();
