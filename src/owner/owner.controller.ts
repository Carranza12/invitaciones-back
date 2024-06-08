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
  } from '@nestjs/common';
  import { OwnerService } from './owner.service';
  import { Owner } from './schemas/owner.schema';
  import { Request, } from 'express';

  
  @Controller('api/owner')
  export class OwnerController {
    constructor(private readonly _ownerSvc: OwnerService) {}
  
   
    @Post('create')
    async register(
      @Req() request: Request,
    ): Promise<{ message: string }> {
      try {
        return await this._ownerSvc.register(request);
      } catch (error) {
        console.log('error:', error);
        throw new UnauthorizedException(
          'No tienes permiso para registrar nuevos usuarios.',
        );
      }
    }
  
  }
  