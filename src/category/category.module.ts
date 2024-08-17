import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { secretKey } from 'src/auth/config';
import { categoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CategorySchema } from './category.schema';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Category', schema: CategorySchema }]),
    JwtModule.register({
      secret: secretKey.secret,
      signOptions: { expiresIn: '8h' },
    }),
  ],
  controllers: [categoryController],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class categoryModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
