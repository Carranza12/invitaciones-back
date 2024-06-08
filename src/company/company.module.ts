import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CompanySchema } from './schemas/company.schema';
import { JwtModule } from '@nestjs/jwt';
import { secretKey } from 'src/auth/config';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Company', schema: CompanySchema }]),
    JwtModule.register({
      secret: secretKey.secret,
      signOptions: { expiresIn: '8h' },
    }),
  ],
  controllers: [CompanyController],
  providers: [CompanyService],
  exports: [CompanyService],
})
export class CompanyModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
