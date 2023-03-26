import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

export type ConstructorDocument = HydratedDocument<Constructor>;

@Schema()
export class Constructor {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  id: string;

  @Prop({ required: true })
  nationality: string;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Driver', default: [] })
  members: [Types.ObjectId];
}

export const ConstructorSchema = SchemaFactory.createForClass(Constructor);
