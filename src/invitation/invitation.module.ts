import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { secretKey } from 'src/auth/config';
import { Invitation, InvitationSchema } from './invitation.schema';
import { InvitationController } from './invitation.controller';
import { InvitationService } from './invitation.service';
import { FileService } from 'src/services/file/file.service';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Invitation.name, schema: InvitationSchema }]),
    JwtModule.register({
      secret: secretKey.secret,
      signOptions: { expiresIn: '8h' },
    }),
  ],
  controllers: [InvitationController],
  providers: [InvitationService, FileService],
  exports: [InvitationService],
})
export class InvitationModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
