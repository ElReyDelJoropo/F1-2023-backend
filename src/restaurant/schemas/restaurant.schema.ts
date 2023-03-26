import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RestaurantDocument = HydratedDocument<Restaurant>;

export class Items {
  name: string;
  type: string;
  price: string;
}

@Schema()
export class Restaurant {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  items: Items[];
}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);
