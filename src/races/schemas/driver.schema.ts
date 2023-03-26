import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type DriverDocument = HydratedDocument<Driver>;

@Schema()
export class Driver {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  dateOfBirth: string;

  @Prop({ required: true, unique: true })
  permanentNumber: number;

  @Prop({ required: true })
  team: string;

  @Prop({ required: true })
  nationality: string;
}

export const DriverSchema = SchemaFactory.createForClass(Driver);
