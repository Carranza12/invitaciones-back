import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Company {

  @Prop( { required: true })
  propertie: string;

  @Prop( { required: true } )
  name: string;

  @Prop( { required: true } )
  typeBusiness: string;

  @Prop( { required: false } )
  members: any[];

  @Prop( { required: false } )
  description: string;

  @Prop( { required: false } )
  tags: any[];

  @Prop( { required: false } )
  address: string;

  @Prop( { required: true } )
  phone: string;

}

export type CompanyDocument = Company & Document;
export const CompanySchema = SchemaFactory.createForClass(Company);