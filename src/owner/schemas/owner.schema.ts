import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User {

  @Prop( { required: true, unique: true })
  user_id: string;

  @Prop( { required: true } )
  company_id: string;

  @Prop( { required: true } )
  Free30Days: boolean;

  @Prop( { required: true } )
  planning_id: string;
 
  @Prop( { required: true } )
  businessType: string;

  @Prop( { required: true } )
  isActivePlanning: boolean;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);