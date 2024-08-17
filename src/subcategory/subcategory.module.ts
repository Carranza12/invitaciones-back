import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { secretKey } from 'src/auth/config';
import { SubcategorySchema } from './subcategory.schema';
import { subcategoryController } from './subcategory.controller';
import { subcategoryService } from './subcategory.service';
import { FileService } from 'src/services/file/file.service';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Subcategory', schema: SubcategorySchema }]),
    JwtModule.register({
      secret: secretKey.secret,
      signOptions: { expiresIn: '8h' },
    }),
  ],
  controllers: [subcategoryController],
  providers: [subcategoryService, FileService],
  exports: [subcategoryService],
})
export class SubcategoryModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
