import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { CompanyService } from './company.service';

@Controller('api/company')
export class CompanyController {
  constructor(private readonly _companySvc: CompanyService) {}

  @Post('create')
  async registerUser(@Req() request: Request): Promise<{ message: string }> {
    try {
      return await this._companySvc.createNew(request);
    } catch (error) {
      console.log('error:', error);
      throw new UnauthorizedException(
        'No tienes permiso para registrar nuevos usuarios.',
      );
    }
  }
}
