import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as path from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  console.log("ruta...", path.join(__dirname, '..', 'src', 'files'))
  await app.listen(3000);
}
bootstrap();
