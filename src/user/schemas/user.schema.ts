import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { limits } from 'src/configuration';

export type UserDocument = HydratedDocument<User>;

@Schema({ versionKey: false })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  lastname: string;

  @Prop({ required: true })
  password: string;

  @Prop({
    required: true,
    unique: true,
    min: limits.dni.min,
    max: limits.dni.max,
  })
  dni: number;

  @Prop({ required: true, min: limits.age.min, max: limits.age.max })
  age: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
