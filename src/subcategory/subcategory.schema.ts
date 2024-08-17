import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Subcategory {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  status: string;

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: false })
  image: string;
}

export type SubcategoryDocument = Subcategory & Document;
export const SubcategorySchema = SchemaFactory.createForClass(Subcategory);
