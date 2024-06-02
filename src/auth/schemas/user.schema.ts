import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User {

  @Prop( { required: true, unique: true })
  email: string;

  @Prop( { required: false } )
  password: string;

  @Prop( { required: true } )
  name: string;

  @Prop( { required: true } )
  last_name: string;

  @Prop( { required: true } )
  role: string;

  @Prop( { required: true } )
  profileImage: string;

}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);