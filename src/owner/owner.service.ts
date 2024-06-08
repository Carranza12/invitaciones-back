import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Owner } from './schemas/owner.schema';
import { Company } from 'src/company/schemas/company.schema';
import { User } from 'src/auth/schemas/user.schema';
const moment = require('moment');

@Injectable()
export class OwnerService {
  constructor(
    @InjectModel(Owner.name) private ownerModel: Model<Owner>,
    @InjectModel(Company.name) private companyModel: Model<Company>,
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    
  ) {}

  async register(req) {
    try {

        const { body } = req;
       
        const { password } = body;
  
        const hash = await bcrypt.hash(password, 10);
  
        const userModelResult = await this.userModel.create({
          email: body.email,
          password: hash,
          name: body.name,
          last_name: body.last_name,
          role: "owner",
          profileImage: ""
        });

        const id_user = userModelResult._id;

       
        const companyModelResult = await this.companyModel.create({
          propertie: id_user,
          name: body.bussinessName,
          typeBusiness: body.typeBusiness,
          members: [],
          description: "",
          tags: [],
          address: '',
          phone: body.phone
        });

        const id_company = companyModelResult._id;

        const nextPaymentDate = moment().add(30, 'days').toDate();

        const ownerModelResult = await this.ownerModel.create({
          user_id: id_user,
          company_id: id_company,
          free30Days: true,
          planning_id: "free",
          nextPaymentDate: nextPaymentDate,
          isActivePlanning: false,
          cancelFree30Days: false
        });
      return { message: 'Usuario registrado con exito!', type: "success",  };
    } catch (error) {
      console.log('error:', error);
      return { message: 'Ocurrio un error: ' + error, type: "error",  };
    }
  }
}
