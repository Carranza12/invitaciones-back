import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  UnauthorizedException,
  Req,
  Put,
  Param,
  Delete,
  Query,
  ParamData,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { OwnerService } from './owner.service';
import { Owner } from './schemas/owner.schema';
import { Request } from 'express';

@Controller('api/owner')
export class OwnerController {
  constructor(private readonly _ownerSvc: OwnerService) {}

  @Post('create')
  async register(@Req() request: Request): Promise<{ message: string }> {
    try {
      return await this._ownerSvc.register(request);
    } catch (error) {
      console.log('error:', error);
      throw new UnauthorizedException(
        'No tienes permiso para registrar nuevos usuarios.',
      );
    }
  }

  @Get('/validate/:companieName')
  async validateCompanieName(@Param('companieName') companieName: string): Promise<any> {
    try {
      return await this._ownerSvc.validateCompanie(companieName);
    } catch (error) {
      console.log('error:', error);
      throw new UnauthorizedException(
        'No tienes permiso para registrar nuevos usuarios.',
      );
    }
  }

  @Post('request-reset-password')
  async requestPasswordReset(@Body('email') email: string) {
    if (!email) {
      throw new BadRequestException('El email es requerido');
    }
    await this._ownerSvc.requestPasswordReset(email);
    return {
      message:
        'Se ha enviado un enlace de restablecimiento de contraseña a tu correo electrónico',
      type: 'success',
    };
  }

  @Post('reset-password')
  async resetPassword(
    @Body('token') token: string,
    @Body('newPassword') newPassword: string,
  ) {
    if (!token || !newPassword) {
      throw new BadRequestException('Token y nueva contraseña son requeridos');
    }
    await this._ownerSvc.resetPassword(token, newPassword);
    return { message: 'Contraseña actualizada con éxito', type: 'success' };
  }
}
