import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { OwnerSchema } from './schemas/owner.schema';
import { OwnerController } from './owner.controller';
import { OwnerService } from './owner.service';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Owner', schema: OwnerSchema }]),
    JwtModule.register({
      secret: '',
      signOptions: { expiresIn: '8h' },
    }),
  ],
  controllers: [OwnerController],
  providers: [OwnerService],
  exports: [OwnerService],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
