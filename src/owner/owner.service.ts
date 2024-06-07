import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Owner } from './schemas/owner.schema';

@Injectable()
export class OwnerService {
  constructor(
    @InjectModel(Owner.name) private ownerModel: Model<Owner>,
    private jwtService: JwtService,
  ) {}

  async createNew(req) {
    try {
      const { body } = req;

      const { password } = body;

      const hash = await bcrypt.hash(password, 10);

      const modelResult = await this.ownerModel.create({
        ...body,
      });
      return { message: 'Usuario registrado con exito!', item: modelResult };
    } catch (error) {
      console.log('error:', error);
      throw new Error('An error occurred while registering the user');
    }
  }
}
