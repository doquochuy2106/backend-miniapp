import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BannerDocument = HydratedDocument<Banner>;

@Schema({ timestamps: true })
export class Banner {
  @Prop({ required: true })
  image: string;

  @Prop({ required: true })
  order: number;
}

export const BannerSchema = SchemaFactory.createForClass(Banner);
