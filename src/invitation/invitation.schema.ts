import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Invitation {
  @Prop({ required: false })
  banner_background: String;

  @Prop({ required: true })
  banner_name: String;

  @Prop({ required: true })
  banner_slogan: String;

  @Prop({ required: true })
  createdAt: Date;

}

export type InvitationDocument = Invitation & Document;
export const InvitationSchema = SchemaFactory.createForClass(Invitation);


