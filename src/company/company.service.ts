import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Company } from './schemas/company.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class CompanyService {

  constructor(
    @InjectModel(Company.name) private companyModel: Model<Company>,
    private jwtService: JwtService,
  ) {}
  
  async createNew(req) {
    try {
      const { body } = req;

      const modelResult = await this.companyModel.create({
        ...body,
      });
      return { message: 'Usuario registrado con exito!', type: "success", item: modelResult };
    } catch (error) {
      console.log('error:', error);
      return { message: 'Ocurrio un error: ' + error, type: "error", item: {} };
    }
  }

 
}
