import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { OwnerSchema } from './schemas/owner.schema';
import { OwnerController } from './owner.controller';
import { OwnerService } from './owner.service';
import { secretKey } from 'src/auth/config';
import { UserSchema } from 'src/auth/schemas/user.schema';
import { CompanySchema } from 'src/company/schemas/company.schema';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Owner', schema: OwnerSchema }]),
    JwtModule.register({
      secret: secretKey.secret,
      signOptions: { expiresIn: '8h' },
    }),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    JwtModule.register({
      secret: secretKey.secret,
      signOptions: { expiresIn: '8h' },
    }),
    MongooseModule.forFeature([{ name: 'Company', schema: CompanySchema }]),
    JwtModule.register({
      secret: secretKey.secret,
      signOptions: { expiresIn: '8h' },
    }),
  ],
  controllers: [OwnerController],
  providers: [OwnerService],
  exports: [OwnerService],
})
export class OwnerModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
