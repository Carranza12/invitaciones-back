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

import { Request } from 'express';
import { InvitationService } from './invitation.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('api/invitation')
export class InvitationController {
  constructor(private readonly _invitationSvc: InvitationService) {}

  @Post('create')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('banner_background'))
  async create(
    @Req() request: Request,
    @UploadedFile() banner_background,
  ): Promise<{ message: string }> {
    try {
      console.log('banner_background:', banner_background);
      console.log('body:', request.body);
      return await this._invitationSvc.create(request, banner_background);
    } catch (error) {
      console.log('error:', error);
      throw new UnauthorizedException(
        'No tienes permiso para registrar nuevos usuarios.',
      );
    }
  }

/*   @Get('/get')
  @UseGuards(AuthGuard)
  async get(@Req() request: any): Promise<any> {
    try {
      request.query.page = request.query.page ? request.query.page : 1;
      request.query.pageSize = request.query.pageSize
        ? request.query.pageSize
        : 10;
      const { name, lastname, email, role_default } = request.query;

      let filters: any = {};

      if (name) {
        filters.name = { $regex: new RegExp(name, 'i') };
      }

      return this._invitationSvc.get(
        request.query.page,
        request.query.pageSize,
        filters,
      );

      throw new UnauthorizedException(
        'No tienes permiso para acceder a esta ruta.',
      );
    } catch (error) {
      throw new UnauthorizedException(
        'No tienes permiso para acceder a esta ruta.',
      );
    }
  }

  @Get('/get/:id')
  @UseGuards(AuthGuard)
  async getUser(@Req() request: any, @Param('id') id: string): Promise<any> {
    try {
      return this._invitationSvc.getById(id);
    } catch (error) {
      throw new UnauthorizedException(
        'No tienes permiso para acceder a esta ruta.',
      );
    }
  }

  @Put('update/:id')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id') userId: string,
    @Body() body: any,
    @Req() request: any,
    @UploadedFile() image,
  ): Promise<{ message: string }> {
    try {
      await this._invitationSvc.update(userId, body, image);
      return { message: 'item actualizado con éxito.' };
    } catch (error) {
      throw new UnauthorizedException('No tienes permiso para editar item.');
    }
  }

  @Delete('/:id')
  @UseGuards(AuthGuard)
  async deleteUser(
    @Param('id') userId: string,
    @Req() request: any,
  ): Promise<{ message: string }> {
    try {
      await this._invitationSvc.delete(userId);
      return { message: 'item eliminado con éxito.' };
    } catch (error) {
      throw new UnauthorizedException('No tienes permiso para eliminar item.');
    }
  } */
}
