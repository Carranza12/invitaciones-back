import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { env } from 'process';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { OwnerModule } from './owner/owner.module';
import { CompanyModule } from './company/company.module';
import { SubcategoryModule } from './subcategory/subcategory.module';
import { FileService } from './services/file/file.service';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';
import { categoryModule } from './category/category.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MulterModule.register({
      dest: './files',
    }),

    MongooseModule.forRoot(env.MONGO_URI),
    SubcategoryModule,
    categoryModule,
    AuthModule,
    OwnerModule,
    CompanyModule,
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'src', 'files'),
      serveRoot: '/src/files',
    }),
  ],
  controllers: [AppController],
  providers: [AppService, FileService],
})
export class AppModule {}
