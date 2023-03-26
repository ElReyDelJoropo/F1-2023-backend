import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Location, SeatMapDto } from '../dto/create-race.dto';

export type RaceDocument = HydratedDocument<Race>;
export type CircuitDocument = HydratedDocument<Circuit>;

@Schema({ versionKey: false })
export class Circuit {
  @Prop({ required: true })
  circuitId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, type: Location })
  location: Location;
}

export class Ocuped {
  vip: number[];
  general: number[];
}

@Schema()
export class Race {
  @Prop({ required: true })
  round: number;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  date: string;

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Restaurant',
    default: [],
  })
  restaurants: [Types.ObjectId];

  @Prop({
    required: true,
  })
  circuit: Circuit;

  @Prop({ required: true, type: SeatMapDto })
  map: SeatMapDto;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Driver', default: [] })
  podium: Types.ObjectId[];
}

export const RaceSchema = SchemaFactory.createForClass(Race);
export const CircuitSchema = SchemaFactory.createForClass(Circuit);
