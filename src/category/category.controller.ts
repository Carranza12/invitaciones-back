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
import { CategoryService } from './category.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('api/category')
export class categoryController {
  constructor(private readonly _categorySvc: CategoryService) {}

  @Post('create')
  @UseGuards(AuthGuard)
  async create(@Req() request: Request): Promise<{ message: string }> {
    try {
      return await this._categorySvc.create(request);
    } catch (error) {
      console.log('error:', error);
      throw new UnauthorizedException(
        'No tienes permiso para registrar nuevos items.',
      );
    }
  }

  @Get('/get')
  @UseGuards(AuthGuard)
  async get(@Req() request: any): Promise<any> {
    try {
      request.query.page = request.query.page ? request.query.page : 1;
      request.query.pageSize = request.query.pageSize
        ? request.query.pageSize
        : 10;
      const { name } = request.query;

      let filters: any = {};

      if (name) {
        filters.name = { $regex: new RegExp(name, 'i') };
      }

      return this._categorySvc.get(
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
      return this._categorySvc.getById(id);
    } catch (error) {
      throw new UnauthorizedException(
        'No tienes permiso para acceder a esta ruta.',
      );
    }
  }

  @Put('update/:id')
  @UseGuards(AuthGuard)
  async update(
    @Param('id') userId: string,
    @Body() body: any,
    @Req() request: any,
  ): Promise<{ message: string }> {
    try {
      await this._categorySvc.update(userId, body);
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
      await this._categorySvc.delete(userId);
      return { message: 'item eliminado con éxito.' };
    } catch (error) {
      throw new UnauthorizedException('No tienes permiso para eliminar item.');
    }
  }
}
