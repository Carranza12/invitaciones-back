import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Owner {

  @Prop( { required: true, unique: true })
  user_id: string;

  @Prop( { required: true } )
  company_id: string;

  @Prop( { required: true } )
  free30Days: boolean;

  @Prop( { required: true } )
  planning_id: string;

  @Prop( { required: true } )
  nextPaymentDate: Date;

  @Prop( { required: true } )
  isActivePlanning: boolean;

  
  @Prop( { required: true } )
  cancelFree30Days: boolean;

  @Prop( { required: true } )
  passwordReset: boolean;
}

export type OwnerDocument = Owner & Document;
export const OwnerSchema = SchemaFactory.createForClass(Owner);